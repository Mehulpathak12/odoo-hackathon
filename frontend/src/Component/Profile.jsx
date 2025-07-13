import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Requests from "./Requests";

export const Profile = () => {
  const navigate = useNavigate();
  const reff = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const [requestPage, setRequestPage] = useState(1);
  const requestsPerPage = 3;

  const [profile, setProfile] = useState({
    name: "John Doe",
    location: "New York",
    photo: "https://via.placeholder.com/100",
    skillsOffered: ["Graphic Design", "Video Editing", "Photoshop"],
    skillsWanted: ["Python", "JavaScript", "Manager"],
    availability: "Weekends",
    visibility: "Public",
    rating: 4.5,
    totalSwaps: 12,
  });

  useEffect(() => {
    const dummyRequests = Array.from({ length: 10 }, (_, i) => ({
      name: `Requester ${i + 1}`,
      photo: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${60 + i}.jpg`,
      rating: (Math.random() * 2 + 3).toFixed(1),
      status: i % 3 === 0 ? "Accepted" : i % 3 === 1 ? "Rejected" : "Pending",
      skillsOffered: ["Skill D", "Skill E"],
      skillsWanted: ["Skill Z", "Skill W"],
    }));
    setRequests(dummyRequests);
    setLoading(false);
  }, []);

  const paginatedRequests = requests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

  const handleSave = () => {
    console.log("Profile saved:", profile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-tr from-indigo-50 to-black px-4 py-6 font-sans flex items-center justify-center overflow-hidden">
     <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 overflow-auto"
        style={{ maxHeight: "90vh" }}
      >
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="text-green-600 hover:text-green-800 font-medium text-sm md:text-base"
                >
                  ✓ Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm md:text-base"
                >
                  ✗ Discard
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:underline font-medium text-sm md:text-base"
              >
                ✎ Edit Profile
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowRequests(true)}
              className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-md hover:bg-indigo-700 transition"
            >
              View Requests
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-indigo-500 hover:underline text-sm md:text-base"
            >
              Home
            </button>
            <img
              src={profile.photo}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-indigo-300 object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full border rounded-lg px-4 py-2 ${
                isEditing ? "bg-white" : "bg-gray-100"
              } focus:outline-none`}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              value={profile.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className={`w-full border rounded-lg px-4 py-2 ${
                isEditing ? "bg-white" : "bg-gray-100"
              } focus:outline-none`}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rating</label>
            <input
              type="text"
              value={profile.rating + " / 5"}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Total Swaps</label>
            <input
              type="text"
              value={profile.totalSwaps}
              readOnly
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Skills Offered */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Skills Offered</label>
          <div className="flex flex-wrap gap-3">
            {profile.skillsOffered.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-1 bg-blue-100 text-blue-800 text-sm rounded-full shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Skills Wanted</label>
          <div className="flex flex-wrap gap-3">
            {profile.skillsWanted.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-1 bg-orange-100 text-orange-800 text-sm rounded-full shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Availability & Visibility */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Availability</label>
            {isEditing ? (
              <select
                value={profile.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
                className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none"
              >
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
              </select>
            ) : (
              <input
                type="text"
                value={profile.availability}
                readOnly
                className="w-full border rounded-lg px-4 py-2 bg-gray-100 focus:outline-none"
              />
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Profile Visibility</label>
            {isEditing ? (
              <select
                value={profile.visibility}
                onChange={(e) => handleChange("visibility", e.target.value)}
                className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none"
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            ) : (
              <input
                type="text"
                value={profile.visibility}
                readOnly
                className="w-full border rounded-lg px-4 py-2 bg-gray-100 focus:outline-none"
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Requests Modal */}
      <Requests
        show={showRequests}
        onClose={() => setShowRequests(false)}
        requests={requests}
        paginatedRequests={paginatedRequests}
        requestPage={requestPage}
        setRequestPage={setRequestPage}
        requestsPerPage={requestsPerPage}
      />
    </div>
  );
};
