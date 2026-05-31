import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold text-red-500 mb-4">
            <span className="text-3xl">🩸</span>
            <span>BloodLink</span>
          </div>
          <p className="text-sm text-neutral-content/75 leading-relaxed">
            BloodLink is a dedicated platform designed to bridge the gap between voluntary blood donors and recipients. Join us in making a difference and saving lives today.
          </p>
          {/* Social Links */}
          <div className="flex gap-4 mt-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors text-xl" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors text-xl" aria-label="Twitter X">
              <FaXTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors text-xl" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors text-xl" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-neutral-content/75">
            <li>
              <Link to="/" className="hover:text-red-400 hover:underline transition-all">Home</Link>
            </li>
            <li>
              <Link to="/donation-requests" className="hover:text-red-400 hover:underline transition-all">Donation Requests</Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-red-400 hover:underline transition-all">Search Donors</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-red-400 hover:underline transition-all">Become a Donor</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Emergency Support</h3>
          <p className="text-sm text-neutral-content/75 mb-2 leading-relaxed">
            For urgent blood requests or volunteer inquiries, reach out to our 24/7 hotline.
          </p>
          <div className="text-sm font-medium text-white mt-3">
            <p className="flex items-center gap-2 mb-1">
              <span>📞</span> +880 1234 567890
            </p>
            <p className="flex items-center gap-2">
              <span>✉️</span> support@bloodlink.org
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-neutral-focus/40 bg-neutral-900/60 py-6 text-center text-xs text-neutral-content/50">
        <p>Copyright © {new Date().getFullYear()} - All rights reserved by BloodLink Ltd.</p>
      </div>
    </footer>
  );
};

export default Footer;
