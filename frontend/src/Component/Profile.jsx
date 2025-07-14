import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../Context/UserContent";
import Requests from "./Requests";

export const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    updateUser,
    loading,
    requestsSent,
    requestsReceived
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [requestPage, setRequestPage] = useState(1);
  const requestsPerPage = 3;

  const [profile, setProfile] = useState({
    name: "",
    location: "",
    photo: "https://via.placeholder.com/100",
    skillsOffered: [],
    skillsWanted: [],
    availability: "",
    visibility: "Public",
    rating: "No Rating!",
    totalSwaps: 0,
  });
  

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        location: user.location || "",
        photo: user.photoUrl || "https://via.placeholder.com/100",
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: Array.isArray(user.availability)
          ? user.availability.join(", ")
          : user.availability || "",
        visibility: user.isPublic ? "Public" : "Private",
        rating: user.ratings || "No Rating!",
        totalSwaps: user.totalSwaps || 0,
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const updatedData = {
        name: profile.name,
        location: profile.location,
        skillsOffered: profile.skillsOffered,
        skillsWanted: profile.skillsWanted,
        availability: profile.availability
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        isPublic: profile.visibility === "Public",
        photoUrl: profile.photo,
      };

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      updateUser(updated.profile);

      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const combinedRequests = [
    ...requestsReceived.map((r) => ({ ...r, type: "received" })),
    ...requestsSent.map((r) => ({ ...r, type: "sent" })),
  ];

  const paginatedRequests = combinedRequests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleRemoveSkill = (field, index) => {
  setProfile((prev) => ({
    ...prev,
    [field]: prev[field].filter((_, i) => i !== index)
  }));
};

const handleAddSkill = (field) => {
  const newSkill = prompt(`Enter a new skill to add to ${field === "skillsOffered" ? "Skills Offered" : "Skills Wanted"}:`);

  if (newSkill && newSkill.trim() !== "") {
    setProfile((prev) => ({
      ...prev,
      [field]: [...prev[field], newSkill.trim()],
    }));
  }
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
                <button onClick={handleSave} className="text-green-600 font-medium text-sm">
                  ✓ Save
                </button>
                <button onClick={() => setIsEditing(false)} className="text-red-500 font-medium text-sm">
                  ✗ Discard
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:underline font-medium text-sm">
                ✎ Edit Profile
              </button>
            )}
          </div>

            
          <div className="flex items-center gap-4">
            <button onClick={() => setShowRequests(true)} className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-md">
              View Requests
            </button>
            <button onClick={() => navigate("/")} className="text-indigo-500 hover:underline text-sm">
              Home
            </button>
            <img src={profile.photo} alt="Profile" className="w-12 h-12 rounded-full border-2 object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input type="text" value={profile.name} onChange={(e) => handleChange("name", e.target.value)} className={`w-full border rounded-lg px-4 py-2 ${isEditing ? "bg-white" : "bg-gray-100"}`} readOnly={!isEditing} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input type="text" value={profile.location} onChange={(e) => handleChange("location", e.target.value)} className={`w-full border rounded-lg px-4 py-2 ${isEditing ? "bg-white" : "bg-gray-100"}`} readOnly={!isEditing} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rating</label>
            <input type="text" value={profile.rating} readOnly className="w-full border rounded-lg px-4 py-2 bg-gray-100" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Total Swaps</label>
            <input type="text" value={profile.totalSwaps} readOnly className="w-full border rounded-lg px-4 py-2 bg-gray-100" />
          </div>
        </div>

        <div className="mt-6">
  <label className="block text-gray-700 font-medium mb-2">Skills Offered</label>
  <div className="flex flex-wrap gap-3">
    {profile.skillsOffered.map((skill, i) => (
      <span key={i} className="flex items-center gap-1 px-4 py-1 bg-blue-100 text-blue-800 text-sm rounded-full shadow-sm">
        {skill}
        {isEditing && (
          <button
            onClick={() => handleRemoveSkill("skillsOffered", i)}
            className="ml-1 text-red-500 hover:text-red-700 font-bold"
          >
            ×
          </button>
        )}
      </span>
    ))}
    {isEditing && (
      <button
        onClick={() => handleAddSkill("skillsOffered")}
        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full shadow"
      >
        + Add Skill
      </button>
    )}
  </div>
</div>

<div className="mt-6">
  <label className="block text-gray-700 font-medium mb-2">Skills Wanted</label>
  <div className="flex flex-wrap gap-3">
    {profile.skillsWanted.map((skill, i) => (
      <span key={i} className="flex items-center gap-1 px-4 py-1 bg-orange-100 text-orange-800 text-sm rounded-full shadow-sm">
        {skill}
        {isEditing && (
          <button
            onClick={() => handleRemoveSkill("skillsWanted", i)}
            className="ml-1 text-red-500 hover:text-red-700 font-bold"
          >
            ×
          </button>
        )}
      </span>
    ))}
    {isEditing && (
      <button
        onClick={() => handleAddSkill("skillsWanted")}
        className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full shadow"
      >
        + Add Skill
      </button>
    )}
  </div>
</div>


        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Availability</label>
            {isEditing ? (
              <select value={profile.availability} onChange={(e) => handleChange("availability", e.target.value)} className="w-full border rounded-lg px-4 py-2 bg-white">
                <option value="Weekends">Weekends</option>
                <option value="Weekdays">Weekdays</option>
              </select>
            ) : (
              <input type="text" value={profile.availability} readOnly className="w-full border rounded-lg px-4 py-2 bg-gray-100" />
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Profile Visibility</label>
            {isEditing ? (
              <select value={profile.visibility} onChange={(e) => handleChange("visibility", e.target.value)} className="w-full border rounded-lg px-4 py-2 bg-white">
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            ) : (
              <input type="text" value={profile.visibility} readOnly className="w-full border rounded-lg px-4 py-2 bg-gray-100" />
            )}
          </div>
        </div>
      </motion.div>

      <Requests
        show={showRequests}
        onClose={() => setShowRequests(false)}
        requests={combinedRequests}
        paginatedRequests={paginatedRequests}
        requestPage={requestPage}
        setRequestPage={setRequestPage}
        requestsPerPage={requestsPerPage}
      />
    </div>
  );
};
