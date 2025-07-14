import React, { useState } from "react";
import { useUser } from "../Context/UserContent";

const Requests = ({
  show,
  onClose,
  requests,
  requestPage,
  setRequestPage,
  requestsPerPage,
}) => {
  const [activeTab, setActiveTab] = useState("received");
  const [actions, setActions] = useState({});
  const { user } = useUser();

  if (!show || !user) return null;

  const filteredRequests = requests.filter((r) =>
    activeTab === "sent"
      ? r.requester.id === user.id
      : r.target.id === user.id
  );

  const paginatedRequests = filteredRequests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

const handleAction = async (index, type) => {
  const globalIndex = (requestPage - 1) * requestsPerPage + index;
  const req = paginatedRequests[index];

  try {
    const res = await fetch(`/api/swaps/${req._id}/respond`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: type }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("API Response Error:", result);
      throw new Error("Failed to update request status");
    }

    setActions((prev) => ({ ...prev, [globalIndex]: type }));
  } catch (err) {
    console.error("Failed to update request:", err);
  }
};



  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 text-lg hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">
          Swap Requests
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {["received", "sent"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setRequestPage(1);
              }}
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500">
            No {activeTab} requests found.
          </p>
        ) : (
          <>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {paginatedRequests.map((req, i) => {
                const globalIndex = (requestPage - 1) * requestsPerPage + i;
                const action = actions[globalIndex];

                const isSent = activeTab === "sent";
                const userData = isSent ? req.target : req.requester;

                return (
                  <div
                    key={req._id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img
                          src={userData.photoUrl}
                          className="w-12 h-12 rounded-full border"
                          alt="user"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {userData.name}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            Status: {req.status}
                          </p>
                        </div>
                      </div>

                      {isSent && (
                        <p
                          className={`font-medium text-sm ${
                            req.status === "accepted"
                              ? "text-green-600"
                              : req.status === "rejected"
                              ? "text-red-500"
                              : "text-yellow-600"
                          }`}
                        >
                          {req.status}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                      <p>
                        <strong>Skill Offered:</strong> {req.skillOffered}
                      </p>
                      <p>
                        <strong>Skill Requested:</strong> {req.skillRequested}
                      </p>
                      {req.message && (
                        <p>
                          <strong>Message:</strong> {req.message}
                        </p>
                      )}
                    </div>

                    {!isSent && req.status === "pending" && (
                      <div className="mt-4 text-right">
                        {!action ? (
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => handleAction(i, "accepted")}
                              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(i, "rejected")}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <p
                            className={`font-medium mt-2 ${
                              action === "Accepted"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            Request {action.toLowerCase()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({
                length: Math.ceil(filteredRequests.length / requestsPerPage),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRequestPage(i + 1)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    requestPage === i + 1
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Requests;
