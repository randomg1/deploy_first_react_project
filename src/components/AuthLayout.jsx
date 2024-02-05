import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "./container/Container";


//confusing

export default function Protected({children}){

    const navigate=useNavigate()
    // const [loader,setLoader]=useState(true)
    const authStatus=useSelector((state)=>state.auth.status)
    
    console.log(authStatus)

    useEffect(()=>{
        if(!authStatus){
            navigate("/login")      //use navigate in useEffect not in just if else statements
            
        }
    },[authStatus])
    //if(!authStatus){
     //   navigate("/login")
        // return (
        //     <div className="w-full py-8 mt-4 text-center">
        //         <Container>
        //             <div className="flex flex-wrap">
        //                 <div className="p-2 w-full">
        //                     <h1 className="text-2xl font-bold hover:text-gray-500">
                                
        //                     </h1>
        //                 </div>
        //             </div>
        //         </Container>
        //     </div>
        // )
    //}
    //  useEffect(()=>{

    //     // if(authentication && authStatus !== authentication){
    //     //     navigate("/login")

    //     // }else if(!authentication && authStatus!==authentication){
    //     //     navigate("/")
    //     // }

    //     setLoader(false)    //this statemen will be exectued in always
    // },[authStatus,navigate,authentication])

    return authStatus?  <>{children}</>:null
}