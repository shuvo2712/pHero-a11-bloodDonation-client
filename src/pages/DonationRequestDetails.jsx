import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FaHeart, FaHospital, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaCommentAlt, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/donation-requests/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch request details");
        }
        return res.json();
      })
      .then((data) => {
        setRequest(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Could not load donation request details");
        setLoading(false);
      });
  }, [id]);

  const handleDonateConfirm = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock confirm behavior for Step 29
    // Full backend integration (connecting route PATCH status) is done in Step 31
    setTimeout(() => {
      setRequest((prev) => ({
        ...prev,
        donationStatus: "inprogress",
        donorName: user?.displayName || "",
        donorEmail: user?.email || "",
      }));
      setIsSubmitting(false);
      setIsModalOpen(false);
      toast.success("Thank you! You have committed to this donation.");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-red-600"></span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-base-content mb-4">Request Not Found</h2>
        <p className="text-base-content/75 mb-6">The requested blood donation details could not be found or does not exist.</p>
        <Link to="/donation-requests" className="btn btn-primary">Back to Requests</Link>
      </div>
    );
  }

  const {
    requesterName,
    requesterEmail,
    recipientName,
    recipientDistrict,
    recipientUpazila,
    hospitalName,
    fullAddressLine,
    bloodGroup,
    donationDate,
    donationTime,
    requestMessage,
    donationStatus,
  } = request;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <span className={`badge badge-sm font-semibold mb-2 ${
            donationStatus === "pending"
              ? "badge-warning"
              : donationStatus === "inprogress"
              ? "badge-info"
              : donationStatus === "done"
              ? "badge-success"
              : "badge-error"
          }`}>
            {donationStatus.toUpperCase()}
          </span>
          <h1 className="text-3xl font-extrabold text-base-content">
            Blood Request for {recipientName}
          </h1>
        </div>
        <Link to="/donation-requests" className="btn btn-sm btn-outline border-base-300">
          Back to Requests
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Grid: Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Medical Details */}
          <div className="bg-base-100 border border-base-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-base-content border-b border-base-200 pb-3 mb-4 flex items-center gap-2">
              <span className="text-red-500">🩸</span> Medical & Logistics Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-base-content/90">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <FaHeart className="text-base shrink-0" />
                </div>
                <div>
                  <p className="text-xs text-base-content/60 font-medium">Required Blood Group</p>
                  <p className="font-extrabold text-lg text-red-600">{bloodGroup}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <FaHospital className="text-base shrink-0" />
                </div>
                <div>
                  <p className="text-xs text-base-content/60 font-medium">Hospital Name</p>
                  <p className="font-semibold">{hospitalName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <FaCalendarAlt className="text-base shrink-0" />
                </div>
                <div>
                  <p className="text-xs text-base-content/60 font-medium">Donation Date</p>
                  <p className="font-semibold">{donationDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <FaClock className="text-base shrink-0" />
                </div>
                <div>
                  <p className="text-xs text-base-content/60 font-medium">Donation Time</p>
                  <p className="font-semibold">{donationTime}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-6 border-t border-base-200 pt-4 flex items-start gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-lg mt-0.5">
                <FaMapMarkerAlt className="text-base shrink-0" />
              </div>
              <div className="text-sm text-base-content/95">
                <p className="text-xs text-base-content/60 font-medium">Donation Address</p>
                <p className="font-semibold">{fullAddressLine}</p>
                <p className="text-xs text-base-content/70">{recipientUpazila}, {recipientDistrict}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Message from Requester */}
          <div className="bg-base-100 border border-base-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-base-content border-b border-base-200 pb-3 mb-4 flex items-center gap-2">
              <FaCommentAlt className="text-red-500 shrink-0" /> Request Message
            </h2>
            <p className="text-sm text-base-content/85 leading-relaxed bg-base-200/40 p-4 rounded-xl italic">
              "{requestMessage || "No special message provided by requester."}"
            </p>
          </div>
        </div>

        {/* Right Grid: Requester Profile Info (1 col) */}
        <div className="space-y-6">
          <div className="bg-base-100 border border-base-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-base-content border-b border-base-200 pb-3 mb-4 flex items-center gap-2">
              <FaUser className="text-red-500 shrink-0" /> Requester Info
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <FaUser className="text-sm" />
                </div>
                <div>
                  <p className="text-xs text-base-content/60 font-medium">Name</p>
                  <p className="font-semibold text-sm text-base-content">{requesterName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg">
                  <FaEnvelope className="text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-base-content/60 font-medium">Email</p>
                  <p className="font-semibold text-sm text-base-content truncate">{requesterEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Donate Box */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <p className="text-sm text-red-800 font-semibold mb-3">Can you help?</p>
            <p className="text-xs text-red-700/80 mb-6 leading-relaxed">
              Your donation choice saves lives. Please ensure you are healthy and fit to donate.
            </p>

            {donationStatus === "pending" ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-error text-white w-full rounded-xl bg-red-600 border-none hover:bg-red-700 font-bold transition-all shadow-md"
              >
                Donate
              </button>
            ) : (
              <button
                disabled
                className="btn btn-neutral w-full rounded-xl font-bold cursor-not-allowed opacity-80"
              >
                {donationStatus === "inprogress" ? "In Progress" : donationStatus === "done" ? "Completed" : "Canceled"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* State-Controlled DaisyUI Modal */}
      {isModalOpen && (
        <div className="modal modal-open z-50">
          <div className="modal-box rounded-2xl max-w-md border border-base-200">
            <h3 className="font-extrabold text-xl text-base-content mb-4 flex items-center gap-2">
              <span className="text-red-500">🩸</span> Confirm Blood Donation
            </h3>
            <p className="text-sm text-base-content/75 mb-6">
              You are agreeing to donate blood for <strong>{recipientName}</strong>. Please confirm your details below.
            </p>

            <form onSubmit={handleDonateConfirm} className="space-y-4">
              <div>
                <label className="label text-xs font-semibold text-base-content/70 uppercase">Donor Name</label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="input input-bordered w-full rounded-xl text-sm bg-base-200/50 focus:outline-none cursor-default font-medium"
                />
              </div>

              <div>
                <label className="label text-xs font-semibold text-base-content/70 uppercase">Donor Email</label>
                <input
                  type="text"
                  value={user?.email || ""}
                  readOnly
                  className="input input-bordered w-full rounded-xl text-sm bg-base-200/50 focus:outline-none cursor-default font-medium"
                />
              </div>

              <div className="modal-action flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="btn btn-sm btn-outline border-base-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-sm btn-error text-white bg-red-600 border-none hover:bg-red-700 rounded-xl font-bold px-5 flex items-center gap-1"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      Saving...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;
