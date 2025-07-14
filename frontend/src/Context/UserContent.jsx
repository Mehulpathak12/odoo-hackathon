import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [requestsSent, setRequestsSent] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);
  const [posts, setPosts] = useState([]);
  const [publicUsers, setPublicUsers] = useState([]);
  const [uniqueSkills, setUniqueSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const updateUser = (data) => setUser(data);

  async function fetchUserData(userId) {
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user by ID");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }

  async function fetchPublicUsers() {
    try {
      const res = await fetch("/api/users/public");
      if (!res.ok) throw new Error("Failed to fetch public users");
      const data = await res.json();
      const users = data.users || [];
      setPublicUsers(users);

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

  async function fetchAllPosts() {
    try {
      const res = await fetch(`/api/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }

  async function sendRequest({ toUserId, skillWanted, skillOffered, message }) {
    try {
      const res = await fetch(`/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUserId,
          fromUserId: user.id,
          skillWanted,
          skillOffered,
          message,
        }),
      });
      if (!res.ok) throw new Error("Failed to send request");
      return await res.json();
    } catch (err) {
      console.error("Failed to send request:", err);
    }
  }

  async function uploadProfilePhoto(file) {
  if (!file || !user?.id) return;

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const res = await fetch("/api/auth/profile/photo", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload profile photo");

    const data = await res.json();

    const updatedUser = { ...user, photoUrl: data.photoUrl };
    setUser(updatedUser);
    updateUser(updatedUser);
  } catch (err) {
    console.error("Profile photo upload failed:", err);
  }
}


  async function fetchSentRequests() {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/requests/sent/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch sent requests");
      const data = await res.json();
      setRequestsSent(data);
    } catch (err) {
      console.error("Failed to fetch sent requests:", err);
    }
  }

  async function fetchReceivedRequests() {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/requests/received/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch received requests");
      const data = await res.json();
      setRequestsReceived(data);
    } catch (err) {
      console.error("Failed to fetch received requests:", err);
    }
  }

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        if (data?.profile) {
          setUser(data.profile);
        }
      } catch (err) {
        console.error("Failed to fetch logged-in user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoggedInUser();
  }, []);

  const value = {
    user,
    setUser,
    updateUser,
    fetchUserData,
    uploadProfilePhoto,
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
    loading,
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
