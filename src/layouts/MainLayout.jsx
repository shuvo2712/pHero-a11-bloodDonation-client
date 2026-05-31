import { Outlet, Link } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm px-4 md:px-8">
        <div className="navbar-start">
          <Link to="/" className="text-2xl font-bold text-primary">PawMart</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2 font-medium">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/pets-supplies">Pets & Supplies</Link></li>
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-200 text-base-content border-t border-base-300">
        <aside>
          <p className="font-bold text-lg">PawMart</p>
          <p className="max-w-md my-2 text-sm text-base-content/80">
            PawMart connects local pet owners and buyers for adoption and pet care products.
          </p>
          <p className="text-xs text-base-content/65 mt-4">
            Copyright © 2026 - All right reserved by PawMart
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default MainLayout;
