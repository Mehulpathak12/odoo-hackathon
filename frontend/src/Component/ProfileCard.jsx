import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const dummyData = Array.from({ length: 14 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Mukul Bassi ${i + 1}`,
  photo: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${30 + i}.jpg`,
  rating: (Math.random() * 2 + 3).toFixed(1),
  feedback: [
    "Great at collaborating.",
    "Timely responses and very skilled.",
    "Would love to work again.",
  ],
  skillsOffered: ["JavaScript", "Python", "C++"],
  skillsWanted: ["TypeScript", "React"],
}));

export const ProfileCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = dummyData.find((p) => p.id === id);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg text-gray-700">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">SkillSwap Platform</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate("/")}
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              Home
            </button>
            <button className="text-indigo-600 underline hover:text-indigo-800">
              Swap Request
            </button>
            <img
              src="https://api.dicebear.com/7.x/thumbs/svg?seed=Marc"
              alt="User"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-2/3 space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
              <p className="text-sm text-gray-500">Rating: {profile.rating}/5</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-1">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillsOffered.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-1">Skills Wanted</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillsWanted.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-1">Feedback</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {profile.feedback.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center">
            <img
              src={profile.photo}
              alt="Profile"
              className="w-48 h-48 rounded-full border-4 border-indigo-300 shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Request Button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200">
            Request
          </button>
        </div>
      </div>
    </div>
  );
};
