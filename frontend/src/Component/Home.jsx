import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ChangingLabel from "./Sub/ChangingLabel";
import SkillRequestPopup from "./Sub/SkillRequestPopup";
import Requests from "./Requests";

export const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const reff = useRef();
  const [userName, setUserName] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [uniqueSkills, setUniqueSkills] = useState([]);


  const profilesPerPage = 6;
  const requestsPerPage = 3;

  useEffect(() => {
    fetch("http://localhost:3000/api/users/public")
      .then(res => res.json())
      .then(json => {
        const users = json.users;
        setProfiles(users);
        setFilteredProfiles(users);
  
        // Extract unique skills
        const skillsSet = new Set();
        users.forEach(user => {
          user.skillsOffered.forEach(skill => {
            if (skill && skill !== "No skills offered") {
              skillsSet.add(skill.trim());
            }
          });
        });
  
        setUniqueSkills([...skillsSet]);
      })
      .catch(console.error)
      .finally(() => setLoadingProfiles(false));
  }, []);
  

  useEffect(() => {
    fetch("http://localhost:3000/api/users/public")
      .then(res => res.json())
      .then(json => {
        setProfiles(json.users);
        setFilteredProfiles(json.users);
      })
      .catch(console.error)
      .finally(() => setLoadingProfiles(false));

    // Dummy requests for Requests popup
    const dummyRequests = Array.from({ length: 10 }, (_, i) => ({
      name: `Requester ${i + 1}`,
      photo: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${60 + i}.jpg`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      status: i % 3 === 0 ? "Accepted" : i % 3 === 1 ? "Rejected" : "Pending",
      skillsOffered: ["Skill D", "Skill E"],
      skillsWanted: ["Skill Z", "Skill W"],
      type: i % 2 === 0 ? "received" : "sent"
    }));
    setRequests(dummyRequests);
  }, []);

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = profiles.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.skillsOffered.some(s => s.toLowerCase().includes(term))
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const handleLanguageSearch = () => {
    if (!selectedLanguage) return setFilteredProfiles(profiles);
    const filtered = profiles.filter(p =>
      p.skillsOffered.includes(selectedLanguage)
    );
    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const explore = () => reff.current?.scrollIntoView({ behavior: "smooth" });

  // Pagination slices
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );
  const paginatedRequests = requests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      <header className="bg-white shadow px-8 py-5 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-indigo-700">SkillSwap</h1>
        <div className="flex items-center space-x-4">
          <ChangingLabel
            words={["C++", "React", "Python", "JavaScript", "Go", "Java"]}
            con="Explore Skills like"
            inter={800}
          />
          {isLoggedIn ? (
            <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg">
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
              onClick={() => navigate("/profile")}
              className="px-4 mr-5 py-2 bg-amber-400 text-white rounded-lg shadow-md hover:bg-amber-500 transition"
            >
              Profile
            </button>
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-6">Welcome back, {userName} 👋</h2>
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

      <div ref={reff} className="mt-10 flex flex-col md:flex-row justify-center gap-4 px-6">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onFilter={handleLanguageSearch}
        uniqueSkills={uniqueSkills}
      />

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
        {loadingProfiles ? (
          <p className="text-center">Loading profiles...</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProfiles.map(p => (
                <ProfileCard key={p.id} profile={p} navigate={navigate} />
              ))}
            </div>
            <Pagination
              total={filteredProfiles.length}
              perPage={profilesPerPage}
              current={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
};

// -- Subcomponents for brevity
const Card = ({ title, desc }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-cyan-500">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-gray-700">{desc}</p>
  </div>
);

const PromoCard = ({ text }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-indigo-600">
    <h3 className="text-xl font-semibold text-indigo-600">{text}</h3>
    <p className="mt-2 text-gray-700">Description here...</p>
  </div>
);

const SearchBar = ({
  searchTerm, setSearchTerm, onSearch,
  selectedLanguage, setSelectedLanguage, onFilter,
  uniqueSkills
}) => (
  <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
    <div className="flex w-full md:w-1/2">
      <input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search for users"
        className="flex-grow px-4 py-2 border rounded-l-full"
      />
      <button onClick={onSearch} className="px-4 bg-indigo-600 text-white rounded-r-full">
        Search
      </button>
    </div>
    <div className="flex w-full md:w-1/2">
      <select
        value={selectedLanguage}
        onChange={e => setSelectedLanguage(e.target.value)}
        className="flex-grow px-4 py-2 border rounded-l-full"
      >
        <option value="">Filter by Skill</option>
        {uniqueSkills.map((skill, i) => (
          <option key={i} value={skill}>{skill}</option>
        ))}
      </select>
      <button onClick={onFilter} className="px-4 bg-indigo-600 text-white rounded-r-full">
        Filter
      </button>
    </div>
  </div>
);

const ProfileCard = ({ profile, navigate }) => (
  <div onClick={() => navigate(`/profile/${profile.id}`)} className="cursor-pointer bg-white p-6 rounded-xl shadow-md">
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src={profile.photoUrl} className="w-16 h-16 rounded-full" alt={profile.name} />
        <div>
          <h3 className="text-lg font-semibold">{profile.name}</h3>
          <p className="text-sm text-gray-500">
            Rating: {profile.ratings === "NULL" ? "No Rating" : profile.ratings}
          </p>
        </div>
      </div>
      <SkillRequestPopup />
    </div>
    <div className="mt-4">
      {renderSkills("Offered", profile.skillsOffered)}
      {renderSkills("Wanted", profile.skillsWanted)}
    </div>
  </div>
);

const renderSkills = (label, skills) => (
  <>
    <p className="text-sm font-medium text-gray-700 mb-1">Skills {label}</p>
    <div className="flex flex-wrap gap-2">
      {skills.map((s,i) => (
        <span key={i} className={`px-3 py-1 text-xs rounded-full ${label === "Offered" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
          {s}
        </span>
      ))}
    </div>
  </>
);

const Pagination = ({ total, perPage, current, onPageChange }) => (
  <div className="mt-10 flex justify-center space-x-2">
    {Array.from({ length: Math.ceil(total / perPage) }).map((_, i) => (
      <button
        key={i}
        onClick={() => onPageChange(i + 1)}
        className={`px-4 py-2 rounded-lg font-medium ${
          current === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
);
