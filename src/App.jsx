import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import conf from "./conf/conf";
import {useDispatch} from "react-redux"
import authService from "./appwrite/auth";
import { login,logout } from "./store/authSlice";
import { Header,Footer } from "./components/index";
import {Outlet} from "react-router-dom"


function App() {
  // console.log(import.meta.env.VITE_APPWRITE_URL); //our project is build through vite that's
  //why above syntax , syntaxt will be different for bundlers
  //or we can create conf.js specify all variables there

  const [loading,setLoading]=useState(true)
  const dispatch=useDispatch()
  useEffect(()=> {
    authService.getCurrentUser()
    .then((userData)=> {

        if(userData){

          dispatch(login({userData}))

        }else{
          dispatch(logout())
        }
    })
    .finally(()=> setLoading(false))
  }, [])

  return !loading ? (

    <div className="min-h-screen  flex flex-wrap content-between bg-gray-400">
        <div className="w-full block">
          <Header />
          <main>
            Todo
            <Outlet/>
          </main>
          <Footer/>
        </div>
    </div>
  ):null
}

export default App;
