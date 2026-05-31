import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { API_URL } from "../api/config";

const CheckoutForm = ({ amount, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    setError("");
    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      
      // 1. Create PaymentIntent on server
      const res = await fetch(`${API_URL}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize payment.");
      }

      const { clientSecret } = await res.json();

      // 2. Confirm card payment via Stripe client SDK
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email || "anonymous@funding.com",
              name: user?.displayName || "Anonymous Donor",
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message);
        toast.error(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Save funding data to server
        const fundingInfo = {
          name: user?.displayName || "Anonymous Donor",
          email: user?.email || "anonymous@funding.com",
          amount: parseFloat(amount),
          date: new Date().toISOString(),
          transactionId: paymentIntent.id,
        };

        const saveRes = await fetch(`${API_URL}/funding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fundingInfo),
        });

        if (!saveRes.ok) {
          throw new Error("Payment succeeded but failed to save funding details.");
        }

        toast.success(`Success! Thank you for donating $${amount}.`);
        onSuccess(fundingInfo);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
      toast.error(err.message || "Payment failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-base-200/50 rounded-xl border border-base-300">
        <label className="label font-bold text-sm text-base-content/75 mb-2">
          Card Details
        </label>
        <div className="bg-base-100 p-3 rounded-lg border border-base-300 shadow-sm focus-within:border-primary transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  fontFamily: "Inter, sans-serif",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="text-error text-sm font-bold text-center mt-2">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="btn btn-outline btn-sm font-bold rounded-xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="btn btn-primary btn-sm font-bold text-white rounded-xl shadow-md"
        >
          {processing ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            `Pay $${amount}`
          )}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
