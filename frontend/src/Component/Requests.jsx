import React from "react";

const SwapRequestsModal = ({
  show,
  onClose,
  requests,
  paginatedRequests,
  requestPage,
  setRequestPage,
  requestsPerPage,
}) => {
  if (!show) return null;

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

        {requests.length === 0 ? (
          <p className="text-center text-gray-500">No requests found.</p>
        ) : (
          <>
            <div className=" z-10 space-y-4 max-h-[60vh] bg-white overflow-y-auto pr-2">
        <div className="absolute bottom-[-5rem] left-[-25rem] w-[25rem] h-[28rem] bg-blue-400 rounded-full filter blur-[120px] opacity-60 animate-bounce z-0" />
        <div className="absolute bottom-[-5rem] right-[-25rem] w-[23rem] h-[24rem] bg-blue-400 rounded-full filter blur-[100px] opacity-50 animate-bounce z-0" />
              {paginatedRequests.map((req, i) => (
                <div
                  key={i}
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
                        <h3 className="font-semibold text-gray-800">
                          {req.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Rating: {req.rating}
                        </p>
                      </div>
                    </div>
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
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    <p>
                      <strong>Skills Offered:</strong>{" "}
                      {req.skillsOffered.join(", ")}
                    </p>
                    <p>
                      <strong>Skills Wanted:</strong>{" "}
                      {req.skillsWanted.join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({
                length: Math.ceil(requests.length / requestsPerPage),
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

export default SwapRequestsModal;
