import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !user; ////LOGGED IN BY DEFAULT FOR DEV PURPOSE

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/profile");
        if (res.data.success) setUser(res.data.profile);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const signup = async (formData) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/signup", formData);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Signup failed" };
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", formData);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}