import React, { useState } from "react";

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

  if (!show) return null;

  const filteredRequests = requests.filter((r) => r.type === activeTab);
  const paginatedRequests = filteredRequests.slice(
    (requestPage - 1) * requestsPerPage,
    requestPage * requestsPerPage
  );

  const handleAction = (index, type) => {
    setActions((prev) => ({
      ...prev,
      [index]: type,
    }));
    console.log(`${type} clicked for`, paginatedRequests[index]);
    // TODO: Trigger backend API for Accept/Decline here
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

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab("received");
              setRequestPage(1);
            }}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              activeTab === "received"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Received
          </button>
          <button
            onClick={() => {
              setActiveTab("sent");
              setRequestPage(1);
            }}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              activeTab === "sent"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Sent
          </button>
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-500">No {activeTab} requests found. Send Some?</p>
        ) : (
          <>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {paginatedRequests.map((req, i) => {
                const globalIndex = (requestPage - 1) * requestsPerPage + i;
                const action = actions[globalIndex];

                return (
                  <div
                    key={globalIndex}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img
                          src={req.photo}
                          className="w-12 h-12 rounded-full border"
                          alt="user"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{req.name}</h3>
                          <p className="text-sm text-gray-600">Rating: {req.rating}</p>
                        </div>
                      </div>

                      {activeTab === "sent" && (
                        <div className="text-right">
                          <p className="font-medium text-gray-700">
                            Status:{" "}
                            <span
                              className={
                                req.status === "Accepted"
                                  ? "text-green-600"
                                  : req.status === "Rejected"
                                  ? "text-red-500"
                                  : "text-yellow-600"
                              }
                            >
                              {req.status}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                      <p>
                        <strong>Skills Offered:</strong> {req.skillsOffered.join(", ")}
                      </p>
                      <p>
                        <strong>Skills Wanted:</strong> {req.skillsWanted.join(", ")}
                      </p>
                    </div>

                    {activeTab === "received" && (
                      <div className="mt-4 text-right">
                        {!action ? (
                          <div className="flex gap-3 justify-end">
                            <button
                              onClick={() => handleAction(globalIndex, "Accepted")}
                              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(globalIndex, "Declined")}
                              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <p
                            className={`font-medium mt-2 ${
                              action === "Accepted" ? "text-green-600" : "text-red-500"
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
