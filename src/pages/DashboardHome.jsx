import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  FaUser, 
  FaPlusCircle, 
  FaList, 
  FaTrash, 
  FaEdit, 
  FaEye, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUsers, 
  FaHeartbeat, 
  FaDollarSign,
  FaCalendarAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Loading and profile states
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Donor specific requests states
  const [recentRequests, setRecentRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Delete modal state
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProfileAndRequests = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      // Fetch User profile
      const res = await fetch(`http://localhost:5000/users/${user.email}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const profileData = await res.json();
      setProfile(profileData);

      // If user is a donor, fetch recent 3 requests
      if (profileData.role === "donor") {
        setRequestsLoading(true);
        const reqsRes = await fetch(
          `http://localhost:5000/donation-requests/user/${user.email}?page=1&limit=3`
        );
        if (reqsRes.ok) {
          const reqsData = await reqsRes.json();
          // Endpoint returns { total, requests } when paginated
          setRecentRequests(reqsData.requests || []);
        } else {
          toast.error("Failed to load recent requests.");
        }
        setRequestsLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndRequests();
  }, [user]);

  // Handle donation status update (Done / Cancel)
  const handleStatusUpdate = async (requestId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/donation-requests/status/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update status to ${newStatus}`);
      }

      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(`Donation request status updated to ${newStatus}!`);
        // Refresh requests list
        fetchProfileAndRequests();
      } else {
        toast.error("No updates were made.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update request status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle request deletion
  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;
    setActionLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/donation-requests/${requestToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete donation request.");
      }

      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Donation request deleted successfully!");
        setRequestToDelete(null);
        // Refresh requests list
        fetchProfileAndRequests();
      } else {
        toast.error("Request was not deleted.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete donation request.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const role = profile?.role || "donor";

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="card-body p-6 md:p-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="avatar">
              <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt={profile.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-primary/10 text-primary">
                    {profile?.name ? profile.name[0].toUpperCase() : "U"}
                  </div>
                )}
              </div>
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl md:text-3xl font-extrabold text-base-content">
                Welcome, {profile?.name || user?.displayName || "User"}!
              </h1>
              <p className="text-base-content/60 text-sm mt-1">
                You are currently logged in as a{" "}
                <span className="badge badge-primary badge-sm font-semibold capitalize">
                  {role}
                </span>{" "}
                (Status: {profile?.status || "active"})
              </p>
            </div>
            {role === "donor" && (
              <div className="flex flex-wrap gap-2 justify-center">
                <Link 
                  to="/dashboard/create-donation-request" 
                  className="btn btn-primary font-bold text-white rounded-xl shadow-lg shadow-primary/15"
                >
                  <FaPlusCircle /> Create Request
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Layouts based on Role */}
      {role === "donor" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-base-content">Recent Donation Requests</h2>
              <p className="text-xs text-base-content/50 mt-0.5">Your last 3 blood donation requests</p>
            </div>
            <Link 
              to="/dashboard/my-donation-requests" 
              className="btn btn-outline btn-sm font-bold rounded-xl"
            >
              <FaList /> View All Requests
            </Link>
          </div>

          {requestsLoading ? (
            <div className="flex justify-center p-10">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="card bg-base-100 shadow-md border border-base-200 p-8 text-center">
              <p className="text-base-content/60 font-medium">You haven't created any donation requests yet.</p>
              <div className="mt-4">
                <Link 
                  to="/dashboard/create-donation-request" 
                  className="btn btn-primary btn-sm font-bold text-white rounded-xl"
                >
                  Create First Request
                </Link>
              </div>
            </div>
          ) : (
            <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
              {/* Responsive Container for Tabular Data */}
              <div className="overflow-x-auto w-full">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-base-200/50">
                      <th>Recipient Name</th>
                      <th>Location</th>
                      <th>Date / Time</th>
                      <th>Blood Group</th>
                      <th>Status</th>
                      <th>Donor Info</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-base-200/20 transition-colors">
                        <td className="font-bold text-base-content">{req.recipientName}</td>
                        <td className="text-sm font-medium">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-primary/70 text-xs" />
                            {req.recipientUpazila}, {req.recipientDistrict}
                          </span>
                        </td>
                        <td className="text-sm">
                          <div className="flex flex-col">
                            <span className="font-semibold flex items-center gap-1">
                              <FaCalendarAlt className="text-primary/70 text-xs" />
                              {req.donationDate}
                            </span>
                            <span className="text-xs text-base-content/60 mt-0.5">{req.donationTime}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-error badge-outline font-bold text-xs">
                            {req.bloodGroup}
                          </span>
                        </td>
                        <td>
                          <span className={`badge capitalize font-bold text-xs py-2 px-2.5 rounded-lg border-0 text-white ${
                            req.donationStatus === "pending" ? "bg-warning" :
                            req.donationStatus === "inprogress" ? "bg-info" :
                            req.donationStatus === "done" ? "bg-success" : "bg-neutral"
                          }`}>
                            {req.donationStatus}
                          </span>
                        </td>
                        <td className="text-xs max-w-[180px] truncate">
                          {req.donationStatus === "inprogress" ? (
                            <div className="flex flex-col">
                              <span className="font-bold text-base-content">{req.donorName || "Assigned"}</span>
                              <span className="text-base-content/50 truncate mt-0.5">{req.donorEmail}</span>
                            </div>
                          ) : (
                            <span className="text-base-content/30 font-medium">—</span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-2">
                            {/* Done & Cancel Status Quick Actions */}
                            {req.donationStatus === "inprogress" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(req._id, "done")}
                                  disabled={actionLoading}
                                  className="btn btn-success btn-xs text-white font-bold rounded-lg shadow-sm"
                                  title="Mark as Done"
                                >
                                  <FaCheckCircle /> Done
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(req._id, "canceled")}
                                  disabled={actionLoading}
                                  className="btn btn-neutral btn-xs text-white font-bold rounded-lg shadow-sm"
                                  title="Cancel Request"
                                >
                                  <FaTimesCircle /> Cancel
                                </button>
                              </>
                            )}
                            
                            {/* Edit, Delete, View Actions */}
                            <Link
                              to={`/dashboard/edit-donation-request/${req._id}`}
                              className="btn btn-square btn-ghost btn-xs text-info"
                              title="Edit Request"
                            >
                              <FaEdit className="text-sm" />
                            </Link>
                            <button
                              onClick={() => setRequestToDelete(req)}
                              disabled={actionLoading}
                              className="btn btn-square btn-ghost btn-xs text-error"
                              title="Delete Request"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                            <Link
                              to={`/donation-request/${req._id}`}
                              className="btn btn-square btn-ghost btn-xs text-primary"
                              title="View Details"
                            >
                              <FaEye className="text-sm" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Admin and Volunteer Dashboard Overview Layout */
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-base-content">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Donors Card */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body flex-row items-center gap-5 p-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl shadow-inner">
                  <FaUsers />
                </div>
                <div>
                  <p className="text-sm text-base-content/50 font-bold uppercase tracking-wider">Total Donors</p>
                  <p className="text-3xl font-extrabold text-base-content mt-1">128</p>
                </div>
              </div>
            </div>

            {/* Funding Card */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body flex-row items-center gap-5 p-6">
                <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center text-2xl shadow-inner">
                  <FaDollarSign />
                </div>
                <div>
                  <p className="text-sm text-base-content/50 font-bold uppercase tracking-wider">Total Funding</p>
                  <p className="text-3xl font-extrabold text-base-content mt-1">$4,250</p>
                </div>
              </div>
            </div>

            {/* Requests Card */}
            <div className="card bg-base-100 shadow-xl border border-base-300">
              <div className="card-body flex-row items-center gap-5 p-6">
                <div className="w-14 h-14 rounded-2xl bg-info/10 text-info flex items-center justify-center text-2xl shadow-inner">
                  <FaHeartbeat />
                </div>
                <div>
                  <p className="text-sm text-base-content/50 font-bold uppercase tracking-wider">Donation Requests</p>
                  <p className="text-3xl font-extrabold text-base-content mt-1">36</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* State-controlled DaisyUI Delete Confirmation Modal */}
      {requestToDelete && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl border border-base-300 shadow-2xl">
            <h3 className="font-extrabold text-lg text-error flex items-center gap-2">
              <FaTrash /> Delete Donation Request?
            </h3>
            <p className="py-4 text-sm text-base-content/85">
              Are you sure you want to delete the blood donation request for{" "}
              <span className="font-bold text-base-content">
                {requestToDelete.recipientName}
              </span>
              ? This action is permanent and cannot be undone.
            </p>
            <div className="modal-action">
              <button
                type="button"
                onClick={() => setRequestToDelete(null)}
                disabled={actionLoading}
                className="btn btn-outline btn-ghost btn-sm font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRequest}
                disabled={actionLoading}
                className="btn btn-error btn-sm font-bold text-white rounded-xl shadow-md shadow-error/15"
              >
                {actionLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
