import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeartbeat, FaUsers, FaShieldAlt, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API contact form submission
    setTimeout(() => {
      toast.success(`Thank you, ${formData.name}! Your message has been sent successfully.`);
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-600 to-rose-500 text-white py-20 lg:py-28 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="bg-red-700/50 text-red-100 text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-6 uppercase tracking-wider">
            Be a Hero • Save Lives
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none mb-6">
            Your Donation Can Save <br className="hidden md:inline" />
            <span className="text-red-100 underline decoration-red-200 decoration-wavy">A Precious Life</span> Today
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-red-100/90 mb-10 leading-relaxed">
            BloodLink bridges the gap between voluntary blood donors and those in critical need. Join our community of life-savers and bring hope to someone's family.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto btn bg-white text-red-600 border-none hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-3 rounded-xl shadow-lg font-bold text-base"
            >
              Join as a donor
            </Link>
            <Link 
              to="/search" 
              className="w-full sm:w-auto btn btn-outline border-white text-white hover:bg-white hover:text-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all px-8 py-3 rounded-xl shadow-lg font-bold text-base"
            >
              Search Donors
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Section */}
      <section className="py-20 bg-base-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content">
              Why Donate Blood?
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-4"></div>
            <p className="text-base-content/75 max-w-xl mx-auto">
              Your small contribution has the power to restore health, hope, and happiness in another person's life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-base-200/50 border border-base-300 p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center rounded-xl mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <FaHeartbeat className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-base-content">Save Up to 3 Lives</h3>
              <p className="text-base-content/70 leading-relaxed text-sm">
                Each whole blood donation can be separated into components (red blood cells, plasma, platelets) to save up to three individuals in need.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-base-200/50 border border-base-300 p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center rounded-xl mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <FaUsers className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-base-content">Community Network</h3>
              <p className="text-base-content/70 leading-relaxed text-sm">
                Get instantly connected with active and verified blood donors across Bangladesh's districts and upazilas, making coordination simple.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-base-200/50 border border-base-300 p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center rounded-xl mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <FaShieldAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-base-content">Verified Requests</h3>
              <p className="text-base-content/70 leading-relaxed text-sm">
                Every single donation request is carefully recorded and tracked. Admins and volunteers ensure the requests are authentic for everyone's safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Us Section */}
      <section className="py-20 bg-base-200/40 border-t border-base-200 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-base-content">
              Contact Us
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-4"></div>
            <p className="text-base-content/75 max-w-xl mx-auto">
              Have questions, concerns, or need immediate assistance? We are here to help 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Info Cards Side */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content mb-1">Emergency Hotlines</h4>
                  <p className="text-base-content/70 text-sm mb-1">Call us directly for urgent donation request inquiries.</p>
                  <p className="font-semibold text-red-600 text-base">+880 1234 567890</p>
                  <p className="font-semibold text-red-600 text-base">+880 1999 888777</p>
                </div>
              </div>

              <div className="bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content mb-1">Support & Partnerships</h4>
                  <p className="text-base-content/70 text-sm mb-1">Send us an email and our team will get back to you within 24 hours.</p>
                  <p className="font-semibold text-red-600 text-base">support@bloodlink.org</p>
                </div>
              </div>

              <div className="bg-base-100 border border-base-200 p-6 rounded-2xl shadow-sm flex items-start gap-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-base-content mb-1">Headquarters Address</h4>
                  <p className="text-base-content/70 text-sm leading-relaxed">
                    Level 4, Red Crescent Tower,<br />
                    Motijheel C/A, Dhaka-1000, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form Side */}
            <div className="bg-base-100 border border-base-200 p-8 rounded-2xl shadow-sm flex flex-col justify-between">
              <h3 className="text-xl font-bold mb-6 text-base-content">Send us a message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4 flex-grow">
                <div>
                  <label className="label text-xs font-semibold text-base-content/70 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name" 
                    className="input input-bordered w-full focus:outline-red-500 rounded-lg text-sm bg-base-50/50" 
                    required
                  />
                </div>
                <div>
                  <label className="label text-xs font-semibold text-base-content/70 uppercase">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email" 
                    className="input input-bordered w-full focus:outline-red-500 rounded-lg text-sm bg-base-50/50" 
                    required
                  />
                </div>
                <div>
                  <label className="label text-xs font-semibold text-base-content/70 uppercase">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4" 
                    placeholder="Type your message here..." 
                    className="textarea textarea-bordered w-full focus:outline-red-500 rounded-lg text-sm bg-base-50/50" 
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary w-full text-white bg-red-600 border-none hover:bg-red-700 rounded-lg py-2.5 font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
