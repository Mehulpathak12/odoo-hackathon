// UserContext.js
import { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// Create the provider
export function UserProvider({ children, DefaultUser }) {
  const [user, setUser] = useState(DefaultUser);

  function updateUser(data) {
    setUser(data);
  }

  const value = { user, setUser, updateUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
// useUser.js


export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    console.warn("useUser must be used within a UserProvider");
    return null;
  }

  return context; // contains user, setUser, updateUser
}
