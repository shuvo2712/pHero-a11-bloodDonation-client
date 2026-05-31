import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { districts } from "../assets/districts";
import { upazilas } from "../assets/upazilas";
import { API_URL } from "../api/config";
import { 
  FaUser, 
  FaEnvelope, 
  FaEdit, 
  FaHospital, 
  FaMapMarkerAlt, 
  FaTint, 
  FaCalendarAlt, 
  FaClock, 
  FaComment
} from "react-icons/fa";

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [originalRequest, setOriginalRequest] = useState(null);

  // Form Fields State
  const [recipientName, setRecipientName] = useState("");
  const [recipientDistrict, setRecipientDistrict] = useState("");
  const [recipientUpazila, setRecipientUpazila] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [fullAddressLine, setFullAddressLine] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [donationTime, setDonationTime] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  // Cascading dropdown state
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Fetch the donation request details on mount
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/donation-requests/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch request details.");
        return res.json();
      })
      .then((data) => {
        setOriginalRequest(data);

        // Resolve district ID and upazila ID from district and upazila names stored in DB
        const foundDistrict = districts.find(
          (d) => d.name.toLowerCase() === data.recipientDistrict?.toLowerCase()
        );
        const districtId = foundDistrict ? foundDistrict.id : "";

        const foundUpazila = upazilas.find(
          (u) =>
            u.name.toLowerCase() === data.recipientUpazila?.toLowerCase() &&
            String(u.district_id) === String(districtId)
        );
        const upazilaId = foundUpazila ? foundUpazila.id : "";

        setRecipientName(data.recipientName || "");
        setRecipientDistrict(districtId);
        // Timeout ensures district change finishes loading cascading list before select tries to match upazila ID
        setTimeout(() => {
          setRecipientUpazila(upazilaId);
        }, 50);

        setHospitalName(data.hospitalName || "");
        setFullAddressLine(data.fullAddressLine || "");
        setBloodGroup(data.bloodGroup || "");
        setDonationDate(data.donationDate || "");
        setDonationTime(data.donationTime || "");
        setRequestMessage(data.requestMessage || "");

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load donation request details.");
        setLoading(false);
      });
  }, [id]);

  // Handle cascading upazila dropdown
  useEffect(() => {
    if (recipientDistrict) {
      const filtered = upazilas.filter(
        (u) => String(u.district_id) === String(recipientDistrict)
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [recipientDistrict]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!recipientName.trim()) return toast.error("Recipient Name is required");
    if (!recipientDistrict) return toast.error("Recipient District is required");
    if (!recipientUpazila) return toast.error("Recipient Upazila is required");
    if (!hospitalName.trim()) return toast.error("Hospital Name is required");
    if (!fullAddressLine.trim()) return toast.error("Full Address Line is required");
    if (!bloodGroup) return toast.error("Blood Group is required");
    if (!donationDate) return toast.error("Donation Date is required");
    if (!donationTime) return toast.error("Donation Time is required");
    if (!requestMessage.trim()) return toast.error("Request Message is required");

    setSubmitLoading(true);

    const districtName = districts.find(d => String(d.id) === String(recipientDistrict))?.name || "";
    const upazilaName = upazilas.find(u => String(u.id) === String(recipientUpazila))?.name || "";

    // Form fields patch model
    const updatedData = {
      recipientName,
      recipientDistrict: districtName,
      recipientUpazila: upazilaName,
      hospitalName,
      fullAddressLine,
      bloodGroup,
      donationDate,
      donationTime,
      requestMessage
    };

    fetch(`${API_URL}/donation-requests/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update request.");
        return res.json();
      })
      .then((data) => {
        setSubmitLoading(false);
        if (data.modifiedCount > 0 || data.matchedCount > 0) {
          toast.success("Donation request updated successfully!");
          navigate("/dashboard/my-donation-requests");
        } else {
          toast.error("No changes were made.");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message || "Failed to update donation request.");
        setSubmitLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-base-content">Edit Donation Request</h1>
        <p className="text-base-content/60 text-sm mt-1">
          Modify the details of your blood donation request.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
        {/* Decorative Top Banner */}
        <div className="h-4 bg-gradient-to-r from-primary to-primary-focus"></div>

        <div className="p-6 md:p-8 space-y-6">
          
          {/* Section: Requester (Prefilled & Read-only) */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <FaUser className="text-sm" /> Requester Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Requester Name</span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={originalRequest?.requesterName || ""}
                  className="input input-bordered bg-base-200 cursor-not-allowed font-medium w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Requester Email</span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={originalRequest?.requesterEmail || ""}
                  className="input input-bordered bg-base-200 cursor-not-allowed font-medium w-full"
                />
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Section: Recipient & Location */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-sm" /> Recipient & Location Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control md:col-span-3">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Recipient Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter recipient full name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="input input-bordered font-medium w-full focus:outline-primary"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Recipient District</span>
                </label>
                <select
                  required
                  value={recipientDistrict}
                  onChange={(e) => {
                    setRecipientDistrict(e.target.value);
                    setRecipientUpazila("");
                  }}
                  className="select select-bordered font-medium w-full focus:outline-primary"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Recipient Upazila</span>
                </label>
                <select
                  required
                  value={recipientUpazila}
                  onChange={(e) => setRecipientUpazila(e.target.value)}
                  disabled={!recipientDistrict}
                  className="select select-bordered font-medium w-full focus:outline-primary"
                >
                  <option value="">Select Upazila</option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Blood Group</span>
                </label>
                <select
                  required
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="select select-bordered font-medium w-full focus:outline-primary"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Section: Hospital & Details */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
              <FaHospital className="text-sm" /> Hospital & Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Hospital Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Medical College Hospital"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="input input-bordered font-medium w-full focus:outline-primary"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Full Address Line</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ward 3, Bed 12, Main Building"
                  value={fullAddressLine}
                  onChange={(e) => setFullAddressLine(e.target.value)}
                  className="input input-bordered font-medium w-full focus:outline-primary"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Donation Date</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={donationDate}
                    onChange={(e) => setDonationDate(e.target.value)}
                    className="input input-bordered font-medium w-full focus:outline-primary"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content/75">Donation Time</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={donationTime}
                    onChange={(e) => setDonationTime(e.target.value)}
                    className="input input-bordered font-medium w-full focus:outline-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {/* Section: Message */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-primary flex items-center gap-2">
                <FaComment className="text-sm" /> Request Message
              </span>
            </label>
            <textarea
              required
              rows="4"
              placeholder="Provide a detailed explanation of why the blood is needed..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="textarea textarea-bordered font-medium w-full focus:outline-primary resize-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-donation-requests")}
              disabled={submitLoading}
              className="btn btn-outline btn-ghost font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="btn btn-primary px-10 font-bold text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {submitLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <FaEdit /> Update Donation Request
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default EditDonationRequest;
