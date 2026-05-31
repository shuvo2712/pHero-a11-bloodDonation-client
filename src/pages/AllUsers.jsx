import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { API_URL } from "../api/config";
import {
  FaUsers,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaUserShield,
  FaHandsHelping,
  FaBan,
  FaCheck,
} from "react-icons/fa";

const AllUsers = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const limit = 10;

  const dropdownRef = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const statusQuery = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const res = await fetch(
        `${API_URL}/users?${statusQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        toast.error("You are not authorized to view this page.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch users.");

      const data = await res.json();
      setTotal(data.length);

      // Client-side pagination since server returns all users
      const start = (page - 1) * limit;
      setUsers(data.slice(start, start + limit));
    } catch (err) {
      console.error(err);
      toast.error("Error loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, page, statusFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const handleAction = async (userId, action) => {
    setActionLoading(true);
    setOpenDropdown(null);
    try {
      const token = localStorage.getItem("token");
      let url = "";
      let body = {};

      if (action === "block" || action === "unblock") {
        url = `${API_URL}/users/status/${userId}`;
        body = { status: action === "block" ? "blocked" : "active" };
      } else if (action === "make-admin" || action === "make-volunteer") {
        url = `${API_URL}/users/role/${userId}`;
        body = { role: action === "make-admin" ? "admin" : "volunteer" };
      }

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Action failed.");

      const data = await res.json();
      if (data.modifiedCount > 0) {
        toast.success("User updated successfully!");
        fetchUsers();
      } else {
        toast.error("No changes were made.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to perform action.");
    } finally {
      setActionLoading(false);
    }
  };

  const roleBadge = (role) => {
    if (role === "admin")
      return <span className="badge badge-error text-white text-xs font-bold capitalize">{role}</span>;
    if (role === "volunteer")
      return <span className="badge badge-info text-white text-xs font-bold capitalize">{role}</span>;
    return <span className="badge badge-ghost text-xs font-bold capitalize">{role}</span>;
  };

  const statusBadge = (status) => {
    if (status === "active")
      return <span className="badge badge-success text-white text-xs font-bold capitalize">{status}</span>;
    return <span className="badge badge-neutral text-white text-xs font-bold capitalize">{status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content flex items-center gap-2">
            <FaUsers className="text-primary text-2xl" /> All Users
          </h1>
          <p className="text-base-content/60 text-sm mt-1">
            Manage all registered users ({total} total)
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-base-100 p-2 rounded-xl border border-base-300 shadow-sm">
          <FaFilter className="text-base-content/40 text-sm ml-2" />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="select select-ghost select-sm font-bold focus:outline-none focus:bg-transparent text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : users.length === 0 ? (
        <div className="card bg-base-100 shadow-xl border border-base-300 p-12 text-center max-w-2xl mx-auto">
          <p className="text-base-content/60 font-bold text-lg">No users found.</p>
          <p className="text-base-content/40 text-sm mt-1">
            Try changing the status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
            <div className="overflow-x-auto w-full" ref={dropdownRef}>
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200/50">
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-base-200/20 transition-colors">
                      <td>
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-primary/20"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                            {u.name ? u.name[0].toUpperCase() : "U"}
                          </div>
                        )}
                      </td>
                      <td className="font-bold text-base-content">{u.name}</td>
                      <td className="text-sm text-base-content/70">{u.email}</td>
                      <td>{roleBadge(u.role)}</td>
                      <td>{statusBadge(u.status)}</td>
                      <td className="text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setOpenDropdown(openDropdown === u._id ? null : u._id)
                            }
                            disabled={actionLoading}
                            className="btn btn-ghost btn-xs btn-square"
                            title="Actions"
                          >
                            <FaEllipsisV />
                          </button>

                          {openDropdown === u._id && (
                            <div className="absolute right-0 z-50 mt-1 w-48 bg-base-100 border border-base-300 rounded-xl shadow-xl">
                              <ul className="menu menu-sm p-1">
                                {u.status === "blocked" ? (
                                  <li>
                                    <button
                                      onClick={() => handleAction(u._id, "unblock")}
                                      className="flex items-center gap-2 text-success font-semibold"
                                    >
                                      <FaCheck /> Unblock User
                                    </button>
                                  </li>
                                ) : (
                                  <li>
                                    <button
                                      onClick={() => handleAction(u._id, "block")}
                                      className="flex items-center gap-2 text-error font-semibold"
                                    >
                                      <FaBan /> Block User
                                    </button>
                                  </li>
                                )}
                                {u.role !== "volunteer" && (
                                  <li>
                                    <button
                                      onClick={() => handleAction(u._id, "make-volunteer")}
                                      className="flex items-center gap-2 text-info font-semibold"
                                    >
                                      <FaHandsHelping /> Make Volunteer
                                    </button>
                                  </li>
                                )}
                                {u.role !== "admin" && (
                                  <li>
                                    <button
                                      onClick={() => handleAction(u._id, "make-admin")}
                                      className="flex items-center gap-2 text-warning font-semibold"
                                    >
                                      <FaUserShield /> Make Admin
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
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
  );
};

export default AllUsers;
