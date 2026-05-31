import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { API_URL } from "../api/config";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/donation-requests/public`)

      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching public donation requests:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-base-content mb-3">
          Blood Donation Requests
        </h1>
        <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-3"></div>
        <p className="text-base-content/75 max-w-md mx-auto text-sm">
          All requests shown below are currently pending. Your timely contribution can save a life today.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-red-600"></span>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-base-200/50 border border-base-300 rounded-2xl max-w-md mx-auto">
          <span className="text-5xl block mb-4">🎉</span>
          <h3 className="text-xl font-bold text-base-content mb-2">No Pending Requests</h3>
          <p className="text-sm text-base-content/70">
            There are currently no pending blood donation requests. Thank you for your support!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div
              key={request._id}
              className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 rounded-2xl flex flex-col justify-between"
            >
              <div className="card-body p-6">
                {/* Header */}
                <div className="flex justify-between items-start gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                      <FaUser className="text-sm" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-base-content">
                        {request.recipientName}
                      </h3>
                      <span className="text-xs text-base-content/60">Recipient</span>
                    </div>
                  </div>
                  <span className="badge badge-error text-white font-bold px-3 py-2 text-sm rounded-lg shadow-sm">
                    {request.bloodGroup}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm text-base-content/85 mb-6">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-red-500 shrink-0" />
                    <span>
                      {request.recipientUpazila}, {request.recipientDistrict}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-red-500 shrink-0" />
                    <span>{request.donationDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaClock className="text-red-500 shrink-0" />
                    <span>{request.donationTime}</span>
                  </div>
                </div>

                {/* Action */}
                <Link
                  to={`/donation-request/${request._id}`}
                  className="btn btn-outline border-base-300 hover:border-red-600 hover:bg-red-600 hover:text-white btn-sm w-full rounded-xl font-bold transition-all py-2 h-auto text-xs"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
