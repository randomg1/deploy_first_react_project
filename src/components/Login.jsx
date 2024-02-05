import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";    //because we have to make same named function so change this name
import { useForm} from "react-hook-form"
import authService from "../appwrite/auth";
import {Button,Input,Logo} from "./index";
import { Link } from "react-router-dom";
import { useState } from "react";


function Login(){

    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {register,handleSubmit}=useForm()
    //the useForm hook is used to create a form instance. This hook provides several methods 
    //and properties, including register and handleSubmit, which are used to register form elements
    // and handle form submissions, respectively.
    const [error,setError]=useState("")

    const login=async (data)=>{
        //The data parameter contains the values of the form fields submitted by the user.
        // The values are automatically collected by React Hook Form and passed to the onSubmit function.
       
        setError("")
        try {
            const session=await authService.login(data);
            if(session){
               
                const userData=await authService.getCurrentUser()
               
                if(userData){
                    console.log(userData.$id)
                    dispatch(authLogin(userData))
                    navigate("/")
                }
            }
        } catch (error) {
            
            setError(error.message)
            
        }
    }

    //login by google
   
    const loginGoogle=()=>{
        authService.loginByGoogle();
    }
    
    //login by github
   
    const loginGithub=()=>{
        authService.loginByGithub();
    }
    
    return(
        <div className="flex items-center justify-center w-full"
        >
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10" 
            >
                <div className="mb-2 flex justify-center ">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo  width="100%"  />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>

                {/* if user is not signed up or giving wrong credential then show error */}
                {error && <p className="text-red-600 mt-8 text-center">{error} </p>}

                <form onSubmit={handleSubmit(login) }
                    className="mt-8 ">
                        <div className="space-y-5"> 
                            <Input
                                label="Email" 
                                type="email" 
                                placeholder="Enter your email"
                                {...register("email",{
                                    required:true,
                                    validate:{          // just a regualar expression ,this is just for validation of email (can be ignored )
                                        matchPattern:(value)=> /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.
                                        test(value) || 
                                        "Email address must be a valid address",
                                        }
                                    }
                                    )
                                
                                } 
                            />
                            <Input 
                                label="Password:"
                                type="password"
                                placeholder="Enter your password"
                                {...register ("password",{
                                    required:true,

                                })}
                            />
                            <Button className="w-full" type="submit"  >
                                Sign In
                            </Button>


                        </div>
                    
                </form>
                <div className="mt-8 flex justify-center p-4 " onClick={loginGoogle}>
                    Sign in with Google  
                    
                </div>
                <div className="mt-8 flex justify-center p-4 " onClick={loginGithub}>
                    Sign in with Github  
                    
                </div>
            </div>

        </div>
    )
}

export default Login