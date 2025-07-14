import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContent";

const SkillRequestPopup = ({ toUser }) => {
  const { user, sendRequest } = useUser(); 
  const [showModal, setShowModal] = useState(false);
  const [wantedSkill, setWantedSkill] = useState("");
  const [offeredSkill, setOfferedSkill] = useState("");
  const [reqCheckText, setreqCheckText] = useState("");
  const [message, setMessage] = useState("")
  const [userId,SetUserId] = useState(0)

  const handleSubmit = async () => {
    if (!wantedSkill.trim() || !offeredSkill.trim()) {
      setreqCheckText(
        !wantedSkill.trim()
          ? "Please enter the skill you want to learn."
          : "Please enter the skill you can offer."
      );
      return;
    }

    try {
      await sendRequest(toUser.id, wantedSkill.trim(), offeredSkill.trim(), message.trim());
      setShowModal(false);
      setreqCheckText("");
      setMessage("");
      setWantedSkill("");
      setOfferedSkill("");
    } catch (err) {
      setreqCheckText("Failed to send request. Please try again.");
      console.error("Request error:", err);
    }
  };

  const handleClick = (e, show) => {
    e.stopPropagation();
    setShowModal(show);
  };

  useEffect(() => {
    SetUserId(toUser.id)  
  }, [])
  
  return (
    <div>
      <button
        onClick={(e) => handleClick(e, true)}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
      >
        Request
      </button>

      {showModal && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative"
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Send Skill Swap Request
            </h2>

            <label className="block text-gray-700 font-medium mb-1">
              Skill You Want
            </label>
            <input
              type="text"
              value={wantedSkill}
              onChange={(e) => setWantedSkill(e.target.value)}
              placeholder="e.g. Web Development"
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />

            <label className="block text-gray-700 font-medium mb-1">
              Skill You Offer
            </label>
            <input
              type="text"
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              placeholder="e.g. Graphic Design"
              className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
            <label className="block text-gray-700 font-medium mb-1">
               Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Would you like to Collab!"
              className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
            <div className="flex justify-end gap-2">
              <label className="px-4 text-sm py-2 text-red-500 transition">
                {reqCheckText}
              </label>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillRequestPopup;
