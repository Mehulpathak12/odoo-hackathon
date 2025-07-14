import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContent";

export const FirstTimeprofile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [form, setForm] = useState({
    name: "",
    skillsOffered: [],
    skillsWanted: [],
    availability: "Weekdays",
    visibility: "Public",
  });
  const [inputSkill, setInputSkill] = useState("");
  const [inputWant, setInputWant] = useState("");

 useEffect(() => {
  if (user && user.skillsOffered && user.skillsOffered.length > 0) {
    navigate("/");
  }
}, [user]);


  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (field, value) => {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    if (field === "skillsOffered") setInputSkill("");
    else setInputWant("");
  };

  const removeSkill = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        availability: [form.availability],
        isPublic: form.visibility === "Public",
      };

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      updateUser(updated.profile);
      navigate("/");
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700 text-center">
          Welcome! Set up your profile
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Your full name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills Offered</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputSkill}
              onChange={(e) => setInputSkill(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="e.g. React"
            />
            <button onClick={() => addSkill("skillsOffered", inputSkill)} className="bg-green-500 text-white px-4 rounded-lg">
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skillsOffered.map((skill, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <button onClick={() => removeSkill("skillsOffered", i)} className="text-red-500 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills Wanted</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputWant}
              onChange={(e) => setInputWant(e.target.value)}
              className="flex-1 border rounded-lg px-4 py-2"
              placeholder="e.g. Node.js"
            />
            <button onClick={() => addSkill("skillsWanted", inputWant)} className="bg-orange-500 text-white px-4 rounded-lg">
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skillsWanted.map((skill, i) => (
              <span
                key={i}
                className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <button onClick={() => removeSkill("skillsWanted", i)} className="text-red-500 font-bold">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
          <select
            value={form.availability}
            onChange={(e) => handleChange("availability", e.target.value)}
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
          <select
            value={form.visibility}
            onChange={(e) => handleChange("visibility", e.target.value)}
            className="w-full border rounded-lg px-4 py-2 bg-white"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

