import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SkillRequestPopup from "./Sub/SkillRequestPopup";
import { useUser } from "../Context/UserContent";

export const ProfileCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { publicUsers, fetchPublicUsers } = useUser();

  useEffect(() => {
    fetchPublicUsers();
  }, []);

  const profile = publicUsers.find((user) => user.id === id);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg text-gray-700">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-blue-950 p-10 overflow-hidden">
      <div className="absolute bottom-[-10rem] left-[-10rem] w-[30rem] h-[30rem] bg-amber-200 rounded-full filter blur-[120px] opacity-60 animate-bounce z-0" />
      <div className="absolute bottom-[-2rem] right-[-10rem] w-[28rem] h-[28rem] bg-green-500 rounded-full filter blur-[100px] opacity-50 animate-bounce z-0" />
      <div className="absolute top-[-2rem] right-[-10rem] w-[28rem] h-[28rem] bg-blue-400 rounded-full filter blur-[100px] opacity-30 spin-slow z-0" />

      <div className="relative z-10 max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700">SkillSwap Platform</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate("/")}
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              Home
            </button>
            <img
              src={profile.photoUrl || "https://api.dicebear.com/7.x/thumbs/svg?seed=Marc"}
              alt="User"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:w-2/3 space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
              <p className="text-sm text-gray-500">Rating: {profile.ratings || "No Rating"}/5</p>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-1">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillsOffered?.map((skill, i) => (
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
              <h3 className="text-md font-medium text-gray-700 mb-1">Skills Wanted</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillsWanted?.map((skill, i) => (
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
              <h3 className="text-md font-medium text-gray-700 mb-1">Availability</h3>
              <p className="text-sm text-gray-600">
                {Array.isArray(profile.availability)
                  ? profile.availability.join(", ")
                  : profile.availability || "Not Provided"}
              </p>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-700 mb-1">Visibility</h3>
              <p className="text-sm text-gray-600">{profile.isPublic ? "Public" : "Private"}</p>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center">
            <img
              src={profile.photoUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-48 h-48 rounded-full border-4 border-indigo-300 shadow-lg object-cover"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <SkillRequestPopup toUser={profile} />
        </div>
      </div>
    </div>
  );
};
