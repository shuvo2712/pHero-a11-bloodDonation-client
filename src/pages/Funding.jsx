import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { API_URL } from "../api/config";
import { 
  FaDollarSign, 
  FaHeart, 
  FaCalendarAlt, 
  FaUser, 
  FaRegCreditCard,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight
} from "react-icons/fa";

// Load Stripe outside of component render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Funding = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRaised, setTotalRaised] = useState(0);

  // Modal & Payment states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [amountError, setAmountError] = useState("");
  const [showStripe, setShowStripe] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const limit = 5;

  const fetchFundingData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/funding`);
      if (!res.ok) throw new Error("Failed to fetch funding transactions.");
      const data = await res.json();
      setFunds(data || []);
      
      // Calculate total raised from the full response array
      const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
      setTotalRaised(total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundingData();
  }, []);

  // Handle opening modal
  const openModal = () => {
    setAmountInput("");
    setAmountError("");
    setShowStripe(false);
    setIsModalOpen(true);
  };

  // Handle amount form submission (Proceed to Stripe payment screen)
  const handleAmountSubmit = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(amountInput);
    if (isNaN(amountVal) || amountVal <= 0) {
      setAmountError("Please enter a valid amount greater than $0.");
      return;
    }
    if (amountVal < 1) {
      setAmountError("Minimum funding amount is $1.");
      return;
    }
    setAmountError("");
    setShowStripe(true);
  };

  // Handle successful payment callback
  const handlePaymentSuccess = (newFund) => {
    // Add the new fund to the list immediately
    setFunds((prev) => [newFund, ...prev]);
    setTotalRaised((prev) => prev + newFund.amount);
    setIsModalOpen(false);
  };

  // Pagination calculations
  const totalItems = funds.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const paginatedFunds = funds.slice(startIndex, startIndex + limit);

  // Format date utility
  const formatDate = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-slide-up">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-base-content flex items-center justify-center gap-2">
          <span className="text-red-500">❤️</span> Fund Our Cause
        </h1>
        <p className="text-base-content/75 text-sm md:text-base">
          Every donation supports our mission to build a reliable and accessible network of blood donors. Help us keep the servers running and outreach active!
        </p>
      </div>

      {/* Stats and Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stat Box */}
        <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden flex flex-row items-center p-6 gap-6 relative">
          <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-600 text-3xl">
            <FaDollarSign />
          </div>
          <div>
            <h2 className="text-sm font-bold text-base-content/60 uppercase tracking-wider">
              Total Raised So Far
            </h2>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">
              ${totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="absolute right-4 bottom-4 opacity-5 text-8xl text-emerald-600 pointer-events-none">
            <FaDollarSign />
          </div>
        </div>

        {/* Give Fund Box */}
        <div className="card bg-base-100 shadow-xl border border-base-300 p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <FaHeart className="text-red-500" /> Make a Contribution
            </h3>
            <p className="text-sm text-base-content/75">
              Secure, instant contribution via Stripe Test Mode. Thank you for your kindness!
            </p>
          </div>
          <div className="mt-4">
            <button 
              onClick={openModal}
              className="btn btn-primary w-full md:w-auto font-bold text-white rounded-xl shadow-lg shadow-primary/20"
            >
              Give Fund
            </button>
          </div>
        </div>
      </div>

      {/* Funding History Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-base-content flex items-center gap-2">
          📜 Funding Log
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : funds.length === 0 ? (
          <div className="card bg-base-100 shadow-xl border border-base-300 p-12 text-center max-w-xl mx-auto">
            <p className="text-base-content/60 font-bold text-lg">No contributions logged yet.</p>
            <p className="text-base-content/40 text-sm mt-1">
              Be the first to help support our campaign!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Table wrapper */}
            <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-base-200/50">
                      <th>Contributor</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFunds.map((fund, idx) => (
                      <tr key={idx} className="hover:bg-base-200/20 transition-colors">
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="bg-base-200 p-2 rounded-lg text-sm text-base-content/60">
                              <FaUser />
                            </div>
                            <div>
                              <p className="font-bold text-base-content">{fund.name}</p>
                              <p className="text-xs text-base-content/50">{fund.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="font-bold text-emerald-600">
                          ${fund.amount?.toFixed(2)}
                        </td>
                        <td className="text-sm font-medium">
                          <span className="flex items-center gap-1.5 text-base-content/75">
                            <FaCalendarAlt className="text-primary/70 text-xs" />
                            {formatDate(fund.date)}
                          </span>
                        </td>
                        <td>
                          <span className="font-mono text-xs bg-base-200 text-base-content/65 py-1 px-2.5 rounded-lg border border-base-300">
                            {fund.transactionId || "stripe_test_id"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="join shadow-sm border border-base-300">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="join-item btn btn-sm bg-base-100 hover:bg-base-200 text-base-content"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`join-item btn btn-sm ${
                        page === pageNum 
                          ? "btn-primary text-white font-bold" 
                          : "bg-base-100 hover:bg-base-200 text-base-content"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="join-item btn btn-sm bg-base-100 hover:bg-base-200 text-base-content"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Give Fund DaisyUI Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl border border-base-300 shadow-2xl relative max-w-md">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="font-extrabold text-xl text-base-content flex items-center gap-2 mb-4">
              <FaRegCreditCard className="text-primary" /> Support BloodLink
            </h3>

            {!showStripe ? (
              // Stage 1: Choose Amount
              <form onSubmit={handleAmountSubmit} className="space-y-4">
                <div className="form-control w-full">
                  <label className="label font-bold text-sm text-base-content/70">
                    Enter Donation Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 font-bold text-lg">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="10"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="input input-bordered w-full pl-8 font-bold focus:outline-none focus:border-primary text-lg"
                      min="1"
                      step="any"
                      required
                    />
                  </div>
                  {amountError && (
                    <p className="text-error text-xs font-bold mt-1">{amountError}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-outline btn-sm font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm font-bold text-white rounded-xl shadow-md flex items-center gap-1"
                  >
                    Next <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </form>
            ) : (
              // Stage 2: Card Checkout Form
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  amount={amountInput} 
                  onSuccess={handlePaymentSuccess}
                  onClose={() => setIsModalOpen(false)}
                />
              </Elements>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;
