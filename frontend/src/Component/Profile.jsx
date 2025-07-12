import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

 export const Profile = () => {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "John Doe",
        location: "New York",
        photo: "https://via.placeholder.com/100",
        skillsOffered: ["Graphic Design", "Video Editing", "Photoshop"],
        skillsWanted: ["Python", "JavaScript", "Manager"],
        availability: "Weekends",
        visibility: "Public",
        rating: 4.5,
        totalSwaps: 12
    });

    const handleChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-tr from-indigo-50 to-white px-6 py-10 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 p-12"
            >
                <div className="flex justify-between items-center mb-10">
                    <div className="flex space-x-6">
                        {isEditing ? (
                            <>
                                <button className="text-green-700 hover:text-green-900 font-semibold text-md">✓ Save</button>
                                <button onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-700 font-semibold text-md">✗ Discard</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:underline font-semibold text-md">✎ Edit Profile</button>
                        )}
                    </div>
                    <div className="flex space-x-6 items-center">
                        <button onClick={() => navigate("/requests")} className="text-indigo-600 hover:underline font-semibold text-md">Swap Requests</button>
                        <button onClick={() => navigate("/")} className="text-indigo-600 hover:underline font-semibold text-md">Home</button>
                        <img
                            src={profile.photo}
                            alt="Profile"
                            className="w-16 h-16 rounded-full border-2 border-indigo-300 object-cover"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className={`w-full border border-gray-300 rounded-xl px-5 py-3 ${isEditing ? "bg-white" : "bg-gray-50"} focus:outline-none`}
                            readOnly={!isEditing}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Location</label>
                        <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => handleChange("location", e.target.value)}
                            className={`w-full border border-gray-300 rounded-xl px-5 py-3 ${isEditing ? "bg-white" : "bg-gray-50"} focus:outline-none`}
                            readOnly={!isEditing}
                        />
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Rating</label>
                        <input
                            type="text"
                            value={profile.rating + " / 5"}
                            readOnly
                            className="w-full border border-gray-300 rounded-xl px-5 py-3 bg-gray-50 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Total Swaps</label>
                        <input
                            type="text"
                            value={profile.totalSwaps}
                            readOnly
                            className="w-full border border-gray-300 rounded-xl px-5 py-3 bg-gray-50 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <label className="block text-gray-700 font-medium mb-2">Skills Offered</label>
                    <div className="flex flex-wrap gap-3">
                        {profile.skillsOffered.map((skill, i) => (
                            <span key={i} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm rounded-full shadow-sm">{skill}</span>
                        ))}
                    </div>
                </div>

                <div className="mt-8">
                    <label className="block text-gray-700 font-medium mb-2">Skills Wanted</label>
                    <div className="flex flex-wrap gap-3">
                        {profile.skillsWanted.map((skill, i) => (
                            <span key={i} className="px-4 py-2 bg-orange-100 text-orange-800 text-sm rounded-full shadow-sm">{skill}</span>
                        ))}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Availability</label>
                        {isEditing ? (
                            <select
                                value={profile.availability}
                                onChange={(e) => handleChange("availability", e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-5 py-3 bg-white focus:outline-none"
                            >
                                <option value="Weekdays">Weekdays</option>
                                <option value="Weekends">Weekends</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={profile.availability}
                                readOnly
                                className="w-full border border-gray-300 rounded-xl px-5 py-3 bg-gray-50 focus:outline-none"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Profile Visibility</label>
                        {isEditing ? (
                            <select
                                value={profile.visibility}
                                onChange={(e) => handleChange("visibility", e.target.value)}
                                className="w-full border border-gray-300 rounded-xl px-5 py-3 bg-white focus:outline-none"
                            >
                                <option value="Public">Public</option>
                                <option value="Private">Private</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={profile.visibility}
                                readOnly
                                className="w-full border border-gray-300 rounded-xl px-5 py-3 bg-gray-50 focus:outline-none"
                            />
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

