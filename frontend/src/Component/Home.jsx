import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRequests, setShowRequests] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        
    }, []);

    const handleToggleRequests = () => {
        
    };

    const navigate = useNavigate();

    return (
        <div id="webcrumbs" className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-slate-50 to-indigo-100 font-sans">
            <header className="bg-white shadow border-b border-gray-200 px-8 py-5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">SkillSwap</h1>
                    <div className="flex items-center space-x-4">
                        <details className="relative">
                            <summary className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <span className="material-symbols-outlined text-gray-600">schedule</span>
                                <span className="text-sm font-medium text-gray-700">Availability</span>
                                <span className="material-symbols-outlined text-gray-500">expand_more</span>
                            </summary>
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <div className="py-2">
                                    {["Any Time", "Weekends", "Evenings", "Weekdays"].map(option => (
                                        <div key={option} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700">{option}</div>
                                    ))}
                                </div>
                            </div>
                        </details>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search skills..."
                                className="w-72 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></span>
                        </div>
                        <button onClick={handleToggleRequests} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow">
                            Requests
                        </button>
                        <button onClick={() => navigate("/signin")} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow">
                            Login
                        </button> 
                    </div>
                </div>
            </header>

            {showRequests && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-red-500" onClick={() => setShowRequests(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Swap Requests</h2>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            {requests.map((req, idx) => (
                                <div key={idx} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <img src={req.photo || "https://via.placeholder.com/40"} className="w-12 h-12 rounded-full border" alt="user" />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{req.name}</h3>
                                                <p className="text-sm text-gray-600">Rating: {req.rating || 'N/A'}/5</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-700">Status: <span className={`font-bold ${req.status === 'Accepted' ? 'text-green-600' : req.status === 'Rejected' ? 'text-red-500' : 'text-yellow-600'}`}>{req.status}</span></p>
                                            {req.status === 'Pending' && (
                                                <div className="mt-2 flex space-x-2">
                                                    <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md">Accept</button>
                                                    <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-md">Reject</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-gray-700">
                                        <p><span className="font-semibold">Skills Offered:</span> {req.skillsOffered?.join(', ')}</p>
                                        <p><span className="font-semibold">Skills Wanted:</span> {req.skillsWanted?.join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <p className="text-center col-span-full text-gray-600">Loading profiles...</p>
                    ) : profiles.length === 0 ? (
                        <p className="text-center col-span-full text-gray-500">No profiles found.</p>
                    ) : (
                        profiles.map((profile, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={profile.photo || "https://via.placeholder.com/64"}
                                            alt="Profile"
                                            className="w-16 h-16 rounded-full object-cover border border-gray-300"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                                            <p className="text-sm text-gray-500">Rating: {profile.rating || 'N/A'}/5</p>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium shadow">
                                        Request
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Skills Offered</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {profile.skillsOffered?.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Skills Wanted</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skillsWanted?.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-10 flex justify-center">
                    <nav className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        {[1, 2, 3, 4].map(num => (
                            <button
                                key={num}
                                className={`px-4 py-2 rounded-lg font-medium ${num === 1 ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {num}
                            </button>
                        ))}
                        <span className="px-2 text-gray-400">...</span>
                        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">12</button>
                        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </nav>
                </div>
            </main>
        </div>
    );
};




