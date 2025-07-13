import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [requestsSent, setRequestsSent] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [posts, setPosts] = useState([]);

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

  // 2. Get All Public Posts from Other Users
  async function fetchAllPosts() {
    try {
      const res = await axios.get(`/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }

  // 3. Send Request to a Post
  async function sendRequest({ toUserId, skillWanted, skillOffered, message }) {
    try {
      const res = await axios.post(`/api/requests`, {
        toUserId,
        fromUserId: user._id,
        skillWanted,
        skillOffered,
        message
      });
      return res.data;
    } catch (err) {
      console.error("Failed to send request:", err);
    }
  }

  // 4. Get Requests Sent by the User
  async function fetchSentRequests() {
    try {
      const res = await axios.get(`/api/requests/sent/${user._id}`);
      setRequestsSent(res.data);
    } catch (err) {
      console.error("Failed to fetch sent requests:", err);
    }
  }

  // 5. Get Requests Received by the User
  async function fetchReceivedRequests() {
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
    fetchAllPosts,
    sendRequest,
    fetchSentRequests,
    fetchReceivedRequests,
    requestsSent,
    requestsReceived,
    posts
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
