import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../providers/AuthProvider";
import { districts } from "../assets/districts";
import { upazilas } from "../assets/upazilas";
import { API_URL } from "../api/config";

const Register = () => {
  const navigate = useNavigate();
  const { createUser, updateUserProfile } = useContext(AuthContext);

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      setSelectedUpazila("");
    } else {
      setFilteredUpazilas([]);
      setSelectedUpazila("");
    }
  }, [selectedDistrict]);

  const handleRegister = async (e) => {
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

    setLoading(true);

    try {
      // Step 1: Upload avatar to ImageBB
      const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
      const formData = new FormData();
      formData.append("image", avatar);

      const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });

      const imgData = await imgRes.json();

      if (!imgData.success) {
        toast.error("Avatar upload failed. Please try again.");
        setLoading(false);
        return;
      }

      const imageUrl = imgData.data.display_url;

      // Step 2: Create Firebase user
      await createUser(email, password);

      // Step 3: Update Firebase profile with name and avatar URL
      await updateUserProfile(name, imageUrl);

      // Map district and upazila IDs to their display names
      const districtName = districts.find(d => String(d.id) === String(selectedDistrict))?.name || "";
      const upazilaName = upazilas.find(u => String(u.id) === String(selectedUpazila))?.name || "";

      // Step 4: Save user data in MongoDB via server POST endpoint
      const userData = {
        name,
        email,
        photoURL: imageUrl,
        bloodGroup,
        district: districtName,
        upazila: upazilaName,
      };

      const dbResponse = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const dbData = await dbResponse.json();

      if (dbData.insertedId || dbData.message === "user already exists") {
        toast.success("Registration successful! Welcome aboard.");
        navigate("/");
      } else {
        toast.error("Failed to save user data to server database.");
      }
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please login.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Use at least 6 characters.");
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading || !selectedDistrict}
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
                disabled={loading}
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
                disabled={loading}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="form-control md:col-span-2 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-white font-bold"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Register"
                )}
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
