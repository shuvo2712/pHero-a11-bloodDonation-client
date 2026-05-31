import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "../api/config";
import {
  FaHeartbeat,
  FaFilter,
  FaTrash,
  FaEdit,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const AllDonationRequests = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("donor");

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [requestToDelete, setRequestToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const statusQuery = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const url = `${API_URL}/donation-requests?page=${page}&limit=${limit}${statusQuery}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch donation requests.");

      const data = await res.json();
      setRequests(data.requests || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Error loading donation requests.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the current user's role to conditionally show admin-only actions
  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_URL}/users/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.role) setUserRole(data.role);
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [user, page, statusFilter]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleStatusUpdate = async (requestId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/donation-requests/status/${requestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error(`Failed to update status.`);
      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success(`Status updated to ${newStatus}!`);
        fetchRequests();
      } else {
        toast.error("No changes were made.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!requestToDelete) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/donation-requests/${requestToDelete._id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete request.");
      const data = await res.json();
      if (data.deletedCount > 0) {
        toast.success("Request deleted successfully!");
        setRequestToDelete(null);
        if (requests.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchRequests();
        }
      } else {
        toast.error("No requests were deleted.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete request.");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const isVolunteer = userRole === "volunteer";

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content flex items-center gap-2">
            <FaHeartbeat className="text-primary text-2xl" /> All Blood Donation Requests
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Viewing all requests across all users ({total} total)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto bg-base-100 p-2 rounded-xl border border-base-300 shadow-sm">
          <FaFilter className="text-base-content/40 text-sm ml-2" />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="select select-ghost select-sm font-bold focus:outline-none focus:bg-transparent text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : requests.length === 0 ? (
        <div className="card bg-base-100 shadow-xl border border-base-300 p-12 text-center max-w-2xl mx-auto">
          <p className="text-base-content/60 font-bold text-lg">No requests found.</p>
          <p className="text-base-content/40 text-sm mt-1">
            Try switching the filter to see other requests.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200/50">
                    <th>Recipient Name</th>
                    <th>Requester</th>
                    <th>Location</th>
                    <th>Date / Time</th>
                    <th>Blood Group</th>
                    <th>Status</th>
                    <th>Donor Info</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-base-200/20 transition-colors">
                      <td className="font-bold text-base-content">{req.recipientName}</td>
                      <td className="text-xs text-base-content/60 max-w-[120px] truncate">
                        {req.requesterEmail}
                      </td>
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
                      <td className="text-xs max-w-[160px] truncate">
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
                          {/* Done & Cancel - available to both Admin and Volunteer */}
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

                          {/* Edit & Delete - Admin only, not for Volunteers */}
                          {!isVolunteer && (
                            <>
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
                            </>
                          )}

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

          {/* Pagination */}
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

      {/* Delete Confirmation Modal */}
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

export default AllDonationRequests;
