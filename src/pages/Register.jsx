import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { districts } from "../assets/districts";
import { upazilas } from "../assets/upazilas";

const Register = () => {
  const navigate = useNavigate();

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Cascading Address Dropdowns State
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  // Blood groups array
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Filter upazilas when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const filtered = upazilas.filter(
        (u) => String(u.district_id) === String(selectedDistrict)
      );
      setFilteredUpazilas(filtered);
      setSelectedUpazila(""); // Reset selected upazila
    } else {
      setFilteredUpazilas([]);
      setSelectedUpazila("");
    }
  }, [selectedDistrict]);

  const handleRegister = (e) => {
    e.preventDefault();

    // Validations
    if (!name.trim()) return toast.error("Name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!avatar) return toast.error("Avatar image is required");
    if (!bloodGroup) return toast.error("Blood group is required");
    if (!selectedDistrict) return toast.error("District is required");
    if (!selectedUpazila) return toast.error("Upazila is required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    // UI Simulation (Step 8 is UI only, actual registration logic in Step 9)
    toast.success("Ready for registration! (Proceed to Step 9 to connect Auth)");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-primary mb-2">Create Account</h2>
            <p className="text-base-content/60 text-sm">Join us as a donor and save lives</p>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Address */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Avatar Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Avatar Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full"
                onChange={(e) => setAvatar(e.target.files[0] || null)}
                required
              />
            </div>

            {/* Blood Group */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Blood Group</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                required
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">District</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                required
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Upazila / Subdistrict</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedUpazila}
                onChange={(e) => setSelectedUpazila(e.target.value)}
                disabled={!selectedDistrict}
                required
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                placeholder="Min 6 characters"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-control md:col-span-2 mt-6">
              <button type="submit" className="btn btn-primary w-full text-white font-bold">
                Register
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center text-sm">
            <p className="text-base-content/70">
              Already have an account?{" "}
              <Link to="/login" className="link link-hover link-primary font-bold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
