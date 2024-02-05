import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  //signup 

  async createAccount({ email, password, name }) {  //here we are using async-await but we can use normal promise also 
   
    try{
        const userAccount= await this.account.create(ID.unique(),email,password,name);
        if(userAccount){
          
          //use created successful , no need to go on login page and  login we can redirect it to login
          //here one thing is keep in mind that we have to not verified the email provide by user 
          //and it is necessary but for now we are not doing it 
          return this.login({email,password})
   
        }else{
            return userAccount 
        } 
    }
    catch(error){
      console.log("user singup unsuccessfull")
      throw error;
    }
  }

  //login

  async login({email,password}){

    try{
      return await this.account.createEmailSession(email,password);
      
    } 
    catch(error){
      throw error;
    }
  }

  //login by google

  async loginByGoogle(){

    
    this.account.createOAuth2Session('google', "http://localhost:5173/","http://localhost:5173/signup")
    
  }

  //login by github
  async loginByGithub(){

    this.account.createOAuth2Session('github', "http://localhost:5173/","http://localhost:5173/signup")
  
  }

  //before going on home page check wheather user is logged in or not

  async getCurrentUser(){
    try{

      return await this.account.get()
    }
    catch (error){
      // console.log(error);
      throw error
    }
  }

  //logout

  async logout(){
    try{
      return await this.account.deleteSessions(); //all the sessions of user will be deleted
      // and user will be logged out from all devices
    }
    catch(error){
      console.log("error",error.message)
      throw error;
    }
  }

  
}

const authService = new AuthService();
export default authService;

 //when we make function inside class then no need to use keyword function
/*
 here is step-by-step process of adding google authentication
 1. goto project in appwrite->auth->setting->choose the OAuth2 Provider and enable it
 2. write app id (google client id) and app secret (secret id of client id) , if don't have
    id & secret key then
      1.go to https://console.cloud.google.com/
      2.create project -> Oauth consent screen > fill data provide same email id
      3. au thorized domain  appwrite.io then continue ->continue ->continue and finish
      4. go to credential-> new credential ->Oauth2 clienId->
      5. Authorized JavaScript origins -  http://localhost:5173 -https://cloud.appwrite.io
      6. Authorized redirect URIs - https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/65afcb9becbe5ec0c399 this url is received in step1 when we enabled option
      7. done
  3. add sign in with google button and call loginByGoogle above function
  4.done
   
  
  */

 