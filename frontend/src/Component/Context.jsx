import { createContext } from "react";
import { useState } from "react";
const UserContext=createContext()
function UserProvider({childern,DefaultUser}){
    
    const [user,setUser]=useState(DefaultUser);
    function updateUser(data){
        setUser(data)
    }
    const value={user,setUser}
    return <UserContext value={value}></UserContext>

}