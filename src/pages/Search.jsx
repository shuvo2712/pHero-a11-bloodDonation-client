import { useState, useEffect } from "react";
import { districts } from "../assets/districts";
import { upazilas } from "../assets/upazilas";
import { FaSearch, FaTint, FaMapMarkerAlt, FaFilePdf, FaUserCircle } from "react-icons/fa";
import { API_URL } from "../api/config";

const Search = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

  const handleSearch = (e) => {
    e.preventDefault();

    const districtName = districts.find(d => String(d.id) === String(selectedDistrict))?.name || "";
    const upazilaName = upazilas.find(u => String(u.id) === String(selectedUpazila))?.name || "";

    const params = new URLSearchParams();
    if (bloodGroup) params.append("bloodGroup", bloodGroup);
    if (districtName) params.append("district", districtName);
    if (upazilaName) params.append("upazila", upazilaName);

    setLoading(true);
    setSearched(true);

    fetch(`${API_URL}/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setDonors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-5xl mx-auto animate-slide-up">

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-base-content mb-2">Find Blood Donors</h1>
          <p className="text-base-content/60 text-sm">
            Search for available donors in your area by blood group and location.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden mb-8">
          <div className="h-2 bg-gradient-to-r from-primary to-primary-focus"></div>
          <div className="card-body p-6 md:p-8">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Blood Group */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaTint className="text-primary" /> Blood Group
                    </span>
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="select select-bordered w-full font-medium"
                  >
                    <option value="">Any Blood Group</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" /> District
                    </span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="select select-bordered w-full font-medium"
                  >
                    <option value="">Any District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Upazila */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" /> Upazila
                    </span>
                  </label>
                  <select
                    value={selectedUpazila}
                    onChange={(e) => setSelectedUpazila(e.target.value)}
                    disabled={!selectedDistrict}
                    className="select select-bordered w-full font-medium"
                  >
                    <option value="">Any Upazila</option>
                    {filteredUpazilas.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary px-10 font-bold text-white rounded-xl shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <FaSearch /> Search Donors
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {searched && (
          <div id="donor-results">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : donors.length === 0 ? (
              <div className="card bg-base-100 shadow-xl border border-base-300">
                <div className="card-body text-center py-16">
                  <div className="text-6xl mb-4">🩸</div>
                  <h3 className="text-xl font-bold text-base-content">No Donors Found</h3>
                  <p className="text-base-content/60 mt-2">
                    No active donors match your search criteria. Try adjusting the filters.
                  </p>
                </div>
              </div>
            ) : (
              <div className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden">
                <div className="card-body p-6">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-base-content">
                        Search Results
                      </h2>
                      <p className="text-base-content/60 text-sm mt-0.5">
                        Found <span className="font-bold text-primary">{donors.length}</span> matching donor(s)
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadPDF}
                      className="btn btn-outline btn-primary btn-sm gap-2 no-print"
                    >
                      <FaFilePdf /> Download as PDF
                    </button>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Donor</th>
                          <th>Blood Group</th>
                          <th>District</th>
                          <th>Upazila</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors.map((donor, index) => (
                          <tr key={donor._id}>
                            <td className="font-medium">{index + 1}</td>
                            <td>
                              <div className="flex items-center gap-3">
                                {donor.photoURL ? (
                                  <div className="avatar">
                                    <div className="w-9 h-9 rounded-full ring ring-primary/20">
                                      <img src={donor.photoURL} alt={donor.name} />
                                    </div>
                                  </div>
                                ) : (
                                  <FaUserCircle className="text-3xl text-base-content/40" />
                                )}
                                <span className="font-semibold">{donor.name}</span>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-primary font-bold text-sm py-3 px-3">
                                {donor.bloodGroup}
                              </span>
                            </td>
                            <td>{donor.district || "—"}</td>
                            <td>{donor.upazila || "—"}</td>
                            <td className="text-sm text-base-content/70">{donor.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default Search;
