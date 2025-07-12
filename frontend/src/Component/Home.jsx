import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // Make sure the path is correct

export const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const profilesPerPage = 6;
  const requestsPerPage = 3;

  useEffect(() => {
    const dummyProfiles = Array.from({ length: 14 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
      photo: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${30 + i}.jpg`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      skillsOffered: ["JavaScript", "Python", "C++"],
      skillsWanted: ["Skill X", "Skill Y"],
      status: "Pending"
    }));

    const dummyRequests = Array.from({ length: 10 }, (_, i) => ({
      name: `Requester ${i + 1}`,
      photo: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${60 + i}.jpg`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      status: i % 3 === 0 ? "Accepted" : i % 3 === 1 ? "Rejected" : "Pending",
      skillsOffered: ["Skill D", "Skill E"],
      skillsWanted: ["Skill Z", "Skill W"]
    }));

    setProfiles(dummyProfiles);
    setRequests(dummyRequests);
    setLoading(false);
  }, []);

  const handleSearch = () => {
    const filtered = profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setProfiles(filtered);
  };

  const prof = () =>{
    navigate("/profile")
  }

  const handleLanguageSearch = () => {
    if (selectedLanguage) {
      const filtered = profiles.filter(profile =>
        profile.skillsOffered.includes(selectedLanguage)
      );
      setProfiles(filtered);
    }
  };

  const paginatedProfiles = profiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const paginatedRequests = requests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-indigo-100 font-sans">
      <header className="bg-white shadow border-b border-gray-200 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-indigo-700">SkillSwap</h1>
          <div className="space-x-4">
            <button
              onClick={() => setShowRequests((prev) => !prev)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Requests
            </button>
            
            {isLoggedIn ? (
              <button
                onClick={prof}
                className="px-4 py-2 bg-amber-400 text-white rounded-lg"
              >
                Profile
              </button>
            ) :( console.log("Hi")
            )}

            {isLoggedIn ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mt-5 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
        <div className="flex items-center w-full md:w-1/2 rounded-full overflow-hidden border border-gray-300 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search for users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Search
          </button>
        </div>

        <div className="flex items-center w-full md:w-1/2 rounded-full overflow-hidden border border-gray-300 bg-white shadow-sm">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Language</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="TypeScript">TypeScript</option>
          </select>
          <button
            type="button"
            onClick={handleLanguageSearch}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 font-medium"
          >
            Filter
          </button>
        </div>
      </div>

      {showRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowRequests(false)}
              className="absolute top-4 right-4 text-gray-600"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Swap Requests</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {paginatedRequests.map((req, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img
                        src={req.photo}
                        className="w-12 h-12 rounded-full border"
                        alt="user"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">{req.name}</h3>
                        <p className="text-sm text-gray-600">Rating: {req.rating}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-700">
                        Status: <span className={
                          req.status === "Accepted"
                            ? "text-green-600"
                            : req.status === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-600"
                        }>
                          {req.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    <p><strong>Skills Offered:</strong> {req.skillsOffered.join(", ")}</p>
                    <p><strong>Skills Wanted:</strong> {req.skillsWanted.join(", ")}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: Math.ceil(requests.length / requestsPerPage) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setRequestPage(i + 1)}
                    className={`px-3 py-1 rounded ${requestPage === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <p className="text-center col-span-full">Loading profiles...</p>
          ) : (
            paginatedProfiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => navigate(`/profile/${profile.id}`)}
                className="cursor-pointer bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={profile.photo}
                      className="w-16 h-16 rounded-full border"
                      alt="Profile"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{profile.name}</h3>
                      <p className="text-sm text-gray-500">Rating: {profile.rating}/5</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg">
                    Request
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Skills Offered</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profile.skillsOffered.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Skills Wanted</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsWanted.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 flex justify-center space-x-2">
          {Array.from({ length: Math.ceil(profiles.length / profilesPerPage) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};