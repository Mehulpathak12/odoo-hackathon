import React, { useEffect, useState,useRef, use } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; 
import ChangingLabel from "./Sub/ChangingLabel";
import SkillRequestPopup from "./Sub/SkillRequestPopup";
import Requests from "./Requests"
export const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const reff = useRef();
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
  
  const username = "EXAMPLE USER"
  

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

  
  const explore = () => {
    reff.current?.scrollIntoView({ behavior: 'smooth' });
  } 
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
            
            
            <label className="mr-10 text-indigo-600 font-bold text-2xl"> 
            <ChangingLabel words={["C++", "React", "Python", "JavaScript", "Go", "Java"]} con={"Explore Skills like"} inter={800} />
            </label>

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

    {!isLoggedIn ? (
  <div className="bg-gradient-to-br from-white to-gray-100 py-20 px-6 sm:px-12 lg:px-24">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
        Empower Your Skills, Elevate Others
      </h2>
      <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
        <strong>Skill Swap</strong> is a collaborative platform where you can <strong>exchange knowledge</strong> with like-minded learners.
        Whether you're a designer wanting to learn coding or a developer wanting to improve your public speaking—
        there's a perfect match waiting for you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-indigo-600 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">🎯 Find Skill Matches</h3>
          <p className="text-gray-700">
            Connect with users who want what you offer and offer what you want.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-indigo-600 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">🤝 One-on-One Swaps</h3>
          <p className="text-gray-700">
            Schedule real-time learning sessions. No payments—just shared growth.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-indigo-600 hover:shadow-xl transition">
          <h3 className="text-xl font-semibold text-indigo-600 mb-3">🚀 Grow Together</h3>
          <p className="text-gray-700">
            Build confidence, boost your skills, and grow faster with feedback and community support.
          </p>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center gap-5">
        <a
          href="/signup"
          className="bg-indigo-600 text-white text-lg font-medium px-10 py-4 rounded-full shadow-md hover:bg-indigo-700 transition"
        >
          Join Skill Swap Now
        </a>
        <a
          onClick={explore}
          href="#start"
          className="bg-cyan-500 text-white text-lg font-medium px-10 py-4 rounded-full shadow-md hover:bg-cyan-600 transition"
        >
          Explore Some Skill Swaps!
        </a>
      </div>
    </div>
  </div>
) : (
  <div className="relative bg-gradient-to-r from-white to-blue-50 py-20 px-6 sm:px-12 lg:px-24 text-center">

  
  <div className="absolute top-6 right-6 flex gap-4">
    <button
      onClick={() => setShowRequests((prev) => !prev)}
      className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-md hover:bg-indigo-700 transition"
    >
      View Requests
    </button>

    <button
      onClick={prof}
      className="px-4 mr-5 py-2 bg-amber-400 text-white rounded-lg shadow-md hover:bg-amber-500 transition"
    >
      Profile
    </button>
  </div>

  <h2 className="text-4xl font-bold text-gray-800 mb-6">Welcome back, {username} 👋</h2>
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

  <a
    onClick={explore}
    href="#start"
    className="mt-12 inline-block bg-indigo-600 text-white text-lg font-medium px-10 py-4 rounded-full shadow-md hover:bg-indigo-700 transition"
  >
    Explore More Skill Swaps!
  </a>
</div>

)}


      <div ref={reff} className="mt-5 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
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

      <Requests 
        show={showRequests}
        onClose={() => setShowRequests(false)}
        requests={requests}
        paginatedRequests={paginatedRequests}
        requestPage={requestPage}
        setRequestPage={setRequestPage}
        requestsPerPage={requestsPerPage}
      />

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
                  <SkillRequestPopup/>
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
