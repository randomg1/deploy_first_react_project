import {createSlice} from "@reduxjs/toolkit"


const initialState={
    status:false,   //this  will show wheather the user logged-in
                    // or not if yes then show only signup and login buttons
                    // and if not then show only logout button
    userData:null

}
const authSlice=createSlice({
   name:'auth',
   initialState,
   reducers: {

        login:(state,action)=>{
            state.status=true;
            state.userData=action.payload.userData;
        },
        logout:(state,action)=>{
            state.status=false;
            state.userData=null;
        }
   }
})

export const {login,logout}=authSlice.actions;

export default authSlice.reducer