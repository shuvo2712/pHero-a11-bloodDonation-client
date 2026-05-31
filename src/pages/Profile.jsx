import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { districts } from "../assets/districts";
import { upazilas } from "../assets/upazilas";
import { API_URL } from "../api/config";
import { 
  FaUser, 
  FaEnvelope, 
  FaTint, 
  FaMapMarkerAlt, 
  FaShieldAlt, 
  FaCamera 
} from "react-icons/fa";

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBloodGroup, setEditBloodGroup] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [editUpazila, setEditUpazila] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Cascading dropdown state
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const fetchProfile = () => {
    if (user?.email) {
      setLoading(true);
      fetch(`${API_URL}/users/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load user profile");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Handle cascading upazila dropdown
  useEffect(() => {
    if (editDistrict) {
      const filtered = upazilas.filter(
        (u) => String(u.district_id) === String(editDistrict)
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [editDistrict]);

  const handleStartEdit = () => {
    if (!profile) return;

    // Resolve IDs from names stored in DB
    const foundDistrict = districts.find(d => d.name.toLowerCase() === profile.district?.toLowerCase());
    const districtId = foundDistrict ? foundDistrict.id : "";

    const foundUpazila = upazilas.find(
      u => u.name.toLowerCase() === profile.upazila?.toLowerCase() && String(u.district_id) === String(districtId)
    );
    const upazilaId = foundUpazila ? foundUpazila.id : "";

    setEditName(profile.name);
    setEditBloodGroup(profile.bloodGroup || "");
    setEditDistrict(districtId);
    // Timeout to ensure district ID change finishes setting upazilas array before selecting upazila ID
    setTimeout(() => {
      setEditUpazila(upazilaId);
    }, 50);

    setAvatarFile(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAvatarFile(null);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!editName.trim()) return toast.error("Name is required");
    if (!editBloodGroup) return toast.error("Blood group is required");
    if (!editDistrict) return toast.error("District is required");
    if (!editUpazila) return toast.error("Upazila is required");

    setSaveLoading(true);

    try {
      let finalImageUrl = profile.photoURL;

      // 1. Upload new avatar if selected
      if (avatarFile) {
        const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
        const formData = new FormData();
        formData.append("image", avatarFile);

        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: "POST",
          body: formData,
        });

        const imgData = await imgRes.json();
        if (!imgData.success) {
          throw new Error("Avatar image upload failed.");
        }
        finalImageUrl = imgData.data.display_url;
      }

      // 2. Map IDs back to Names
      const districtName = districts.find(d => String(d.id) === String(editDistrict))?.name || "";
      const upazilaName = upazilas.find(u => String(u.id) === String(editUpazila))?.name || "";

      // 3. Construct update payload
      const updatedFields = {
        name: editName,
        photoURL: finalImageUrl,
        bloodGroup: editBloodGroup,
        district: districtName,
        upazila: upazilaName,
      };

      // 4. Update Database
      const patchRes = await fetch(`${API_URL}/users/${profile._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      const patchData = await patchRes.json();

      if (patchData.modifiedCount > 0 || patchData.matchedCount > 0) {
        // 5. Sync Firebase Auth user profile
        await updateUserProfile(editName, finalImageUrl);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchProfile(); // reload profile
      } else {
        toast.error("No changes were made.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-bold text-error">Profile Not Found</h3>
        <p className="text-base-content/60 mt-2">Could not retrieve your user information from the database.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-base-content">My Profile</h1>
        <p className="text-base-content/60 text-sm mt-1">View and edit your personal profile information</p>
      </div>

      <form onSubmit={handleSaveProfile}>
        {/* Main Profile Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
          {/* Decorative Top Banner */}
          <div className="h-32 bg-gradient-to-r from-primary to-primary-focus"></div>

          {/* Profile Details Container */}
          <div className="p-6 md:p-8 relative">
            {/* Avatar and Basic Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 -mt-20 md:-mt-24 mb-8">
              <div className="avatar relative">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-200">
                  {avatarFile ? (
                    <img 
                      src={URL.createObjectURL(avatarFile)} 
                      alt="New avatar preview" 
                      className="object-cover w-full h-full"
                    />
                  ) : profile.photoURL ? (
                    <img src={profile.photoURL} alt={profile.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-primary/10 text-primary">
                      {profile.name[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Optional Image Uploader Overlay when in Edit Mode */}
                {isEditing && (
                  <label className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full cursor-pointer hover:scale-105 transition-all shadow-md">
                    <FaCamera className="text-sm" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => setAvatarFile(e.target.files[0] || null)}
                      disabled={saveLoading}
                    />
                  </label>
                )}
              </div>

              <div className="text-center md:text-left mt-2 md:mt-6 flex-grow">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h2 className="text-2xl font-extrabold">{profile.name}</h2>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <span className="badge badge-primary font-bold uppercase py-2 px-3 text-xs">
                      {profile.role || "Donor"}
                    </span>
                    <span className={`badge font-bold py-2 px-3 text-xs ${
                      profile.status === "active" ? "badge-success text-white" : "badge-error text-white"
                    }`}>
                      {profile.status || "Active"}
                    </span>
                  </div>
                </div>
                <p className="text-base-content/60 text-sm mt-1 flex items-center justify-center md:justify-start gap-2">
                  <FaEnvelope className="text-primary/70" /> {profile.email}
                </p>
              </div>

              {/* Action Buttons toggle */}
              <div className="mt-4 md:mt-6 flex gap-2">
                {!isEditing ? (
                  <button 
                    type="button"
                    onClick={handleStartEdit} 
                    className="btn btn-primary px-8 font-bold text-white rounded-xl shadow-lg shadow-primary/20"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button 
                      type="submit" 
                      disabled={saveLoading}
                      className="btn btn-success px-8 font-bold text-white rounded-xl shadow-lg shadow-success/10"
                    >
                      {saveLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button 
                      type="button"
                      onClick={handleCancelEdit} 
                      disabled={saveLoading}
                      className="btn btn-outline btn-ghost px-6 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="divider my-6"></div>

            {/* Profile Fields Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                    <FaUser className="text-primary/70" /> Full Name
                  </span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={saveLoading}
                    className="input input-bordered font-medium w-full"
                    placeholder="Enter your name"
                  />
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={profile.name}
                    className="input input-bordered bg-base-200 cursor-not-allowed font-medium w-full"
                  />
                )}
              </div>

              {/* Email Address (Strictly Read-only) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                    <FaEnvelope className="text-primary/70" /> Email Address
                  </span>
                </label>
                <input
                  type="email"
                  readOnly
                  value={profile.email}
                  className="input input-bordered bg-base-200 cursor-not-allowed font-medium w-full"
                />
              </div>

              {/* Blood Group */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                    <FaTint className="text-primary/70" /> Blood Group
                  </span>
                </label>
                {isEditing ? (
                  <select
                    required
                    value={editBloodGroup}
                    onChange={(e) => setEditBloodGroup(e.target.value)}
                    disabled={saveLoading}
                    className="select select-bordered font-medium w-full"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={profile.bloodGroup}
                    className="input input-bordered bg-base-200 cursor-not-allowed font-medium w-full"
                  />
                )}
              </div>

              {/* District */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary/70" /> District
                  </span>
                </label>
                {isEditing ? (
                  <select
                    required
                    value={editDistrict}
                    onChange={(e) => {
                      setEditDistrict(e.target.value);
                      setEditUpazila("");
                    }}
                    disabled={saveLoading}
                    className="select select-bordered font-medium w-full"
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={profile.district}
                    className="input input-bordered bg-base-200 cursor-not-allowed font-medium w-full"
                  />
                )}
              </div>

              {/* Upazila */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary/70" /> Upazila / Subdistrict
                  </span>
                </label>
                {isEditing ? (
                  <select
                    required
                    value={editUpazila}
                    onChange={(e) => setEditUpazila(e.target.value)}
                    disabled={saveLoading || !editDistrict}
                    className="select select-bordered font-medium w-full"
                  >
                    <option value="">Select Upazila</option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    readOnly
                    value={profile.upazila}
                    className="input input-bordered bg-base-200 cursor-not-allowed font-medium w-full"
                  />
                )}
              </div>

              {/* Credentials / Details */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-base-content/70 flex items-center gap-2">
                    <FaShieldAlt className="text-primary/70" /> Access Credentials
                  </span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={`${profile.role ? profile.role.toUpperCase() : "DONOR"} (Status: ${profile.status ? profile.status.toUpperCase() : "ACTIVE"})`}
                  className="input input-bordered bg-base-200 cursor-not-allowed font-medium w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
