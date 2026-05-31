import { useContext } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { 
  FaHome, 
  FaUser, 
  FaList, 
  FaPlusCircle, 
  FaUsers, 
  FaHeartbeat, 
  FaSignOutAlt 
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive 
        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
        : "text-base-content/75 hover:bg-base-200 hover:text-base-content"
    }`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Main content container */}
      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        {/* Mobile Top Header */}
        <div className="navbar bg-base-100 border-b border-base-300 lg:hidden px-4 shadow-sm">
          <div className="flex-none">
            <label 
              htmlFor="dashboard-drawer" 
              className="btn btn-square btn-ghost drawer-button"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                className="inline-block w-6 h-6 stroke-current"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 font-extrabold text-xl text-primary px-2">
            🩸 BloodLink
          </div>
        </div>

        {/* Dashboard Pages Outlet Area */}
        <div className="p-6 md:p-8 flex-grow">
          <Outlet />
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="drawer-side z-50">
        <label 
          htmlFor="dashboard-drawer" 
          aria-label="close sidebar" 
          className="drawer-overlay"
        ></label>
        
        <div className="menu p-5 w-80 min-h-full bg-base-100 text-base-content border-r border-base-300 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-base-200 mb-6">
              <span className="text-3xl">🩸</span>
              <span className="font-extrabold text-2xl text-primary tracking-tight">BloodLink</span>
            </div>

            {/* Profile Brief Overview */}
            {user && (
              <div className="flex items-center gap-4 px-4 py-3 bg-base-200/60 border border-base-300 rounded-2xl mb-8">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="w-12 h-12 rounded-full object-cover border border-primary/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate leading-tight">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs text-base-content/50 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Menus */}
            <div className="space-y-1.5">
              <NavLink to="/dashboard" end className={navLinkClass}>
                <FaHome className="text-lg" />
                <span>Dashboard Home</span>
              </NavLink>

              <NavLink to="/dashboard/profile" className={navLinkClass}>
                <FaUser className="text-lg" />
                <span>Profile</span>
              </NavLink>

              <NavLink to="/dashboard/my-donation-requests" className={navLinkClass}>
                <FaList className="text-lg" />
                <span>My Donation Requests</span>
              </NavLink>

              <NavLink to="/dashboard/create-donation-request" className={navLinkClass}>
                <FaPlusCircle className="text-lg" />
                <span>Create Donation Request</span>
              </NavLink>

              {/* Roles division divider */}
              <div className="divider text-xs text-base-content/40 font-semibold my-6">
                ADMIN & VOLUNTEER
              </div>

              <NavLink to="/dashboard/all-users" className={navLinkClass}>
                <FaUsers className="text-lg" />
                <span>All Users</span>
              </NavLink>

              <NavLink to="/dashboard/all-blood-donation-request" className={navLinkClass}>
                <FaHeartbeat className="text-lg" />
                <span>All Donation Requests</span>
              </NavLink>
            </div>
          </div>

          {/* Action Links */}
          <div className="border-t border-base-200 pt-4 mt-6">
            <button 
              onClick={handleLogout} 
              className="btn btn-outline btn-error w-full flex items-center justify-center gap-2 rounded-xl py-3"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
