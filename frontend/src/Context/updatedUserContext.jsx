import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [requestsSent, setRequestsSent] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [posts, setPosts] = useState([]);
  const [publicUsers, setPublicUsers] = useState([]);
  const [uniqueSkills, setUniqueSkills] = useState([]);

  const updateUser = (data) => setUser(data);

  // 1. Get Logged In User Info
  async function fetchUserData(userId) {
    try {
      const res = await axios.get(`/api/user/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }

  // 2. Get All Public Users and Extract Unique Skills
  async function fetchPublicUsers() {
    try {
      const res = await axios.get("/api/users/public");
      const users = res.data.users || [];

      setPublicUsers(users);

      // Extract unique skills from users' skillsOffered
      const skillSet = new Set();
      users.forEach((user) => {
        user.skillsOffered?.forEach((skill) => {
          if (skill && skill.trim() && skill !== "No skills offered") {
            skillSet.add(skill.trim());
          }
        });
      });

      setUniqueSkills(Array.from(skillSet));
    } catch (err) {
      console.error("Failed to fetch public users:", err);
    }
  }

  // 3. Get All Public Posts from Other Users
  async function fetchAllPosts() {
    try {
      const res = await axios.get(`/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }

  // 4. Send Request to a Post/User
  async function sendRequest({ toUserId, skillWanted, skillOffered, message }) {
    try {
      const res = await axios.post(`/api/requests`, {
        toUserId,
        fromUserId: user._id,
        skillWanted,
        skillOffered,
        message,
      });
      return res.data;
    } catch (err) {
      console.error("Failed to send request:", err);
    }
  }

  // 5. Get Requests Sent by the User
  async function fetchSentRequests() {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/api/requests/sent/${user._id}`);
      setRequestsSent(res.data);
    } catch (err) {
      console.error("Failed to fetch sent requests:", err);
    }
  }

  // 6. Get Requests Received by the User
  async function fetchReceivedRequests() {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/api/requests/received/${user._id}`);
      setRequestsReceived(res.data);
    } catch (err) {
      console.error("Failed to fetch received requests:", err);
    }
  }

  const value = {
    user,
    setUser,
    updateUser,
    fetchUserData,
    fetchPublicUsers,
    fetchAllPosts,
    sendRequest,
    fetchSentRequests,
    fetchReceivedRequests,
    publicUsers,
    requestsSent,
    requestsReceived,
    uniqueSkills,
    posts,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    console.warn("useUser must be used within a UserProvider");
    return null;
  }
  return context;
};
