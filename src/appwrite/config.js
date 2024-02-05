import conf from "../conf/conf";
import { Client,ID,Databases,Storage,Query } from "appwrite";

export class Service{
    client=new Client()
    databases;
    bucket;//bucket is nothing but storage . storage and databases both are different
    //databases are for storing structured data while  storage is used for unstructed data like images,video,audio,etc.

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases=new Databases(this.client)
        this.bucket=new Storage(this.client)
    }
    
    //createDocument
    async createPost({title,slug,content,featuredImage,status,userId}){

        try{
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,    //[DATABASE_ID]
                conf.appwriteCollectionId,  //[COLLECTION_ID]
                slug,                       //[DOCUMENT_ID]
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        }
        catch(error){
            throw error;
        }
    }

    //updateDocument
    async updatePost(slug,{title,content,featuredImage,status}){
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )     
        }
        catch(error){
            console.log("Appwrite Service :: updataPost :: error",error)
        }
    }
    //delete document
    async deletePost(slug){
        try {
            
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        } catch (error) {
            console.log("appwrite:service::deletePost::error",error)
            return false;
        }
    }

    //get Document
    async getPost(slug){

        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            return false
        }
    }

    //get Documents via queries
    async getPosts(){
        try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal('status','active')  //show only those posts which are active now and not deactivated by auther
                ]
            )
        }
        catch(error){
            console.log("appwrite service :: getPosts :: error",error)
            
        }
    }

    //upload file
    async uploadFile(file){
        try{
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        }
        catch(error){
            return false;
        }

    }

    //delete file
    async deleteFile(fileId){

        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            throw error;
        }
    }

    //getFilePreview ->it is a method that can be used to generate a preview
                    // URL for a file. It is commonly used to generate URLs for 
                    //image and video previews uploaded to the Appwrite storage service. 

    getFilePreview(fileId){

        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )

    }
}

const service=new Service()
export default service;


//in class no need to write data types of variables,functions