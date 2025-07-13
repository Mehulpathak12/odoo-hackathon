import React, { useEffect, useState,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useUser } from "../Context/UserContent";
import ChangingLabel from "./Sub/ChangingLabel";
import SkillRequestPopup from "./Sub/SkillRequestPopup";
import Requests from "./Requests";

export const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const {
    user,
    fetchPublicUsers,
    fetchSentRequests,
    fetchReceivedRequests,
    publicUsers,
    requestsSent,
    requestsReceived,
    uniqueSkills
  } = useUser();

  console.log(user)
  const reff = useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);
  const [showRequests, setShowRequests] = useState(false);
  const profilesPerPage = 6;
  const requestsPerPage = 3;

  useEffect(() => {
    fetchPublicUsers();
    fetchSentRequests();
    fetchReceivedRequests();
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;
    return publicUsers.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleLanguageSearch = () => {
    if (!selectedLanguage) return publicUsers;
    return publicUsers.filter(profile =>
      profile.skillsOffered.includes(selectedLanguage)
    );
  };

  const prof = () => navigate("/profile");

  const explore = () => {
    reff.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProfiles = selectedLanguage ? handleLanguageSearch() : handleSearch() || publicUsers;
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const combinedRequests = [
    ...requestsReceived.map(r => ({ ...r, type: "received" })),
    ...requestsSent.map(r => ({ ...r, type: "sent" }))
  ];

  const paginatedRequests = combinedRequests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

  console.log(paginatedProfiles)

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-indigo-100 font-sans">
      <header className="bg-white shadow border-b border-gray-200 px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-indigo-700">SkillSwap</h1>
          <div className="space-x-4">
            <label className="mr-10 text-indigo-600 font-bold text-2xl">
              <ChangingLabel words={["C++", "React", "Python", "JavaScript", "Go", "Java"]} con={"Explore Skills like"} inter={800} />
            </label>
            {isLoggedIn ? (
              <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                Logout
              </button>
            ) : (
              <button onClick={() => navigate("/signin")} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {isLoggedIn ? (
        <div className="relative bg-gradient-to-r from-white to-blue-50 py-20 px-6 sm:px-12 lg:px-24 text-center">
          <div className="absolute top-6 right-6 flex gap-4">
            <button onClick={() => setShowRequests((prev) => !prev)} className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-md hover:bg-indigo-700 transition">
              View Requests
            </button>
            <button onClick={prof} className="px-4 mr-5 py-2 bg-amber-400 text-white rounded-lg shadow-md hover:bg-amber-500 transition">
              Profile
            </button>
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-6">Welcome back, {user?.name || "Learner"} 👋</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Ready to continue your learning journey? Here's your personalized dashboard to explore, connect, and grow!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto text-left">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition border-l-4 border-cyan-500">
              <h3 className="text-xl font-semibold text-cyan-600 mb-2">📚 My Swaps</h3>
              <p className="text-gray-700">Track and manage your active skill swap sessions.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition border-l-4 border-cyan-500">
              <h3 className="text-xl font-semibold text-cyan-600 mb-2">🧠 Discover New Skills</h3>
              <p className="text-gray-700">Explore trending skills and new learning opportunities.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition border-l-4 border-cyan-500">
              <h3 className="text-xl font-semibold text-cyan-600 mb-2">📨 Messages</h3>
              <p className="text-gray-700">View and respond to swap requests from other learners.</p>
            </div>
          </div>

          <a onClick={explore} href="#start" className="mt-12 inline-block bg-indigo-600 text-white text-lg font-medium px-10 py-4 rounded-full shadow-md hover:bg-indigo-700 transition">
            Explore More Skill Swaps!
          </a>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white to-gray-100 py-20 px-6 sm:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
              Empower Your Skills, Elevate Others
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              <strong>Skill Swap</strong> is a collaborative platform where you can <strong>exchange knowledge</strong> with like-minded learners.
            </p>
            <div className="mt-16 flex flex-col items-center gap-5">
              <a href="/signup" className="bg-indigo-600 text-white text-lg font-medium px-10 py-4 rounded-full shadow-md hover:bg-indigo-700 transition">
                Join Skill Swap Now
              </a>
              <a onClick={explore} href="#start" className="bg-cyan-500 text-white text-lg font-medium px-10 py-4 rounded-full shadow-md hover:bg-cyan-600 transition">
                Explore Some Skill Swaps!
              </a>
            </div>
          </div>
        </div>
      )}

      <div ref={reff} className="mt-5 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
        <div className="flex items-center w-full md:w-1/2 rounded-full overflow-hidden border border-gray-300 bg-white shadow-sm">
          <input type="text" placeholder="Search for users" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="button" onClick={handleSearch} className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 font-medium">
            Search
          </button>
        </div>

        <div className="flex items-center w-full md:w-1/2 rounded-full overflow-hidden border border-gray-300 bg-white shadow-sm">
          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select Language</option>
            {uniqueSkills.map((skill, i) => (
              <option key={i} value={skill}>{skill}</option>
            ))}
          </select>
          <button type="button" onClick={handleLanguageSearch} className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 font-medium">
            Filter
          </button>
        </div>
      </div>

      <Requests
        show={showRequests}
        onClose={() => setShowRequests(false)}
        requests={combinedRequests}
        paginatedRequests={paginatedRequests}
        requestPage={requestPage}
        setRequestPage={setRequestPage}
        requestsPerPage={requestsPerPage}
      />

      <main className="max-w-7xl mx-auto px-6 py-10">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {paginatedProfiles.length === 10? (
      <p className="text-center col-span-full">No profiles found.</p>
    ) : (
      paginatedProfiles.map((profile) => (
        <div
          key={profile._id}
          onClick={() => navigate(`/profile/${profile.id}`)}
          className="cursor-pointer bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={profile.photoUrl || "https://via.placeholder.com/100"}
                className="w-16 h-16 rounded-full border"
                alt="Profile"
              />
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-sm text-gray-500">
                  Rating: {profile.ratings && profile.ratings !== "NULL" ? profile.ratings : "No Rating"}/5
                </p>
              </div>
            </div>
            <SkillRequestPopup toUser={profile} />
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Skills Offered</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skillsOffered?.map((skill, i) => (
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
              {profile.skillsWanted?.map((skill, i) => (
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
    {Array.from({ length: Math.ceil(filteredProfiles.length / profilesPerPage) }).map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-4 py-2 rounded-lg font-medium ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "text-gray-600 bg-gray-100"}`}
      >
        {i + 1}
      </button>
    ))}
  </div>
</main>

    </div>
  );
};
