import React from "react";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


function LogoutBtn({

    className="",
}){

    const dispatch=useDispatch()
    const navigate=useNavigate()
    const logoutHandler=()=>{
        try{
            authService.logout().then(()=>{ 
                dispatch(logout())
                navigate("/")
            })
        }
        catch(error){
            console.log("error",error.message)
            throw error
        }
    }
    return (
        <button 
            className={`inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full ${className}`} 
            onClick={logoutHandler}>
            Logout
        </button>
    )
}

export default LogoutBtn