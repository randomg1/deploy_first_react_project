import React , {useState} from "react";
import authService from "../appwrite/auth";
import { Link,useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import {Button,Input,Logo} from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

//useForm is a hook provided by the react-hook-form library, which is a popular 
//form management library for React. It helps you manage the state of your form 
//inputs, handle form submission, and perform form validation with ease.


function Signup(){

    const navigate=useNavigate()
    const [error,setError]=useState("")
    const dispatch=useDispatch()
    const {register,handleSubmit}=useForm()

    const create=async(data)=>{
      
        // console.log("data before sending:",data)     //entire form data
        setError("")
        try {
            const userData=await authService.createAccount(data)
            console.log("data after account creation:",userData)
            
            if(userData){
               
                const userData1=await authService.getCurrentUser()
                console.log("data after getCurrentUser :",userData1)

                if(userData1){
                    
                    dispatch(login(userData1))
                    navigate("/")   //code below this line will also be executed
                }
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return(
        <div className="flex items-center justify-center w-full">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10" 
            >
                <div className="mb-2 flex justify-center ">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo  width="100%"  />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign Up your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Login
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center"> {error}</p>}
                
                <form onSubmit={handleSubmit(create)}
                    className="mt-8">
                        <div className="space-y-5">

                            <Input
                                label="Full Name" 
                                type="text " 
                                placeholder="Enter your full Name"
                                {...register("name",{
                                    required:true
                                    })
                                } 
                                //here we are using register because our input components are not in this component they are elsewhere
                                //if change occurs in inputs then how will we get those data,
                                // 1)declare variables through useState() pass it in child components so that in child data will be stored
                                // in this variable and now in current  file we get input data by variable.
                                //2)use useRef
                                //3) by using register we can register input,select,textarea fields so that in validation
                                //we can apply required,pattern,etc. validations and during submission we will get data of input fields
                                //directly and data will be stored in variable name will be the name of key in register,(e.g here  name is key)

                            />
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
                                    })
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
                            <Button className="w-full"  type="submit" >
                                Create Account
                            </Button>
                            

                        </div>
                    
                </form>
            </div>
        </div>
    )
}

export default Signup