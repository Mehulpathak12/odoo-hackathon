import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../Context/UserContent";
import Requests from "./Requests";

export const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    updateUser,
    uploadProfilePhoto,
    loading,
  } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [requestPage, setRequestPage] = useState(1);
  const requestsPerPage = 3;
  const fileInputRef = useRef(null);

  const [combinedRequests, setCombinedRequests] = useState([]);

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

  useEffect(() => {
    if (showRequests && user) {
      fetchRequests();
    }
  }, [showRequests, user]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/swaps", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch swap requests");

      const data = await res.json();
      const swaps = data.swaps || [];
console.log("Fetched swaps:", swaps);
console.log("User ID:", user.id);

      const received = swaps.filter((swap) => swap.target.id === user.id);
      const sent = swaps.filter((swap) => swap.requester.id === user.id);

      const combined = [
        ...received.map((r) => ({ ...r, type: "received" })),
        ...sent.map((r) => ({ ...r, type: "sent" })),
      ];

      setCombinedRequests(combined);
    } catch (err) {
      console.error("Error fetching swap requests:", err);
    }
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await uploadProfilePhoto(file);
  };

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
        photoUrl: user?.photoUrl || profile.photo,
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

  const handleRemoveSkill = (field, index) => {
    setProfile((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = (field) => {
    const newSkill = prompt(
      `Enter a new skill to add to ${field === "skillsOffered" ? "Skills Offered" : "Skills Wanted"}:`
    );
    if (newSkill && newSkill.trim() !== "") {
      setProfile((prev) => ({
        ...prev,
        [field]: [...prev[field], newSkill.trim()],
      }));
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-tr from-indigo-50 to-black px-4 py-6 font-sans flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 overflow-auto"
        style={{ maxHeight: "90vh" }}
      >
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
            <button
              onClick={() => setShowRequests(true)}
              className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-md"
            >
              View Requests
            </button>
            <button onClick={() => navigate("/")} className="text-indigo-500 hover:underline text-sm">
              Home
            </button>
            <img
              src={user?.photoUrl || profile.photo}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 object-cover"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePicUpload}
              accept="image/*"
              style={{ display: "none" }}
            />
            {isEditing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="bg-indigo-600 text-white rounded-2xl h-fit p-2"
              >
                Set Profile Pic
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Name" value={profile.name} onChange={(e) => handleChange("name", e.target.value)} isEditing={isEditing} />
          <InputField label="Location" value={profile.location} onChange={(e) => handleChange("location", e.target.value)} isEditing={isEditing} />
          <InputField label="Rating" value={profile.rating} isEditing={false} />
          <InputField label="Total Swaps" value={profile.totalSwaps} isEditing={false} />
        </div>

        <SkillList title="Skills Offered" skills={profile.skillsOffered} isEditing={isEditing} onRemove={(i) => handleRemoveSkill("skillsOffered", i)} onAdd={() => handleAddSkill("skillsOffered")} />
        <SkillList title="Skills Wanted" skills={profile.skillsWanted} isEditing={isEditing} onRemove={(i) => handleRemoveSkill("skillsWanted", i)} onAdd={() => handleAddSkill("skillsWanted")} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField label="Availability" value={profile.availability} onChange={(val) => handleChange("availability", val)} isEditing={isEditing} options={["Weekends", "Weekdays"]} />
          <SelectField label="Profile Visibility" value={profile.visibility} onChange={(val) => handleChange("visibility", val)} isEditing={isEditing} options={["Public", "Private"]} />
        </div>
      </motion.div>

      <Requests
        show={showRequests}
        onClose={() => setShowRequests(false)}
        requests={combinedRequests}
        requestPage={requestPage}
        setRequestPage={setRequestPage}
        requestsPerPage={requestsPerPage}
      />
    </div>
  );
};

// Reusable input field
const InputField = ({ label, value, onChange, isEditing }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      readOnly={!isEditing}
      className={`w-full border rounded-lg px-4 py-2 ${isEditing ? "bg-white" : "bg-gray-100"}`}
    />
  </div>
);

const SelectField = ({ label, value, onChange, isEditing, options }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    {isEditing ? (
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-lg px-4 py-2 bg-white">
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input value={value} readOnly className="w-full border rounded-lg px-4 py-2 bg-gray-100" />
    )}
  </div>
);

const SkillList = ({ title, skills, isEditing, onRemove, onAdd }) => (
  <div className="mt-6">
    <label className="block text-gray-700 font-medium mb-2">{title}</label>
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, i) => (
        <span key={i} className="flex items-center gap-1 px-4 py-1 bg-blue-100 text-blue-800 text-sm rounded-full shadow-sm">
          {skill}
          {isEditing && (
            <button onClick={() => onRemove(i)} className="ml-1 text-red-500 hover:text-red-700 font-bold">×</button>
          )}
        </span>
      ))}
      {isEditing && (
        <button onClick={onAdd} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full shadow">+ Add Skill</button>
      )}
    </div>
  </div>
);
