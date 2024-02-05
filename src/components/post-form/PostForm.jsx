import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, } from "..";
import RTE from "../RTE";
import Select from "../Select";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


//confusing
export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {    //these values are accesses from getValues and updated by setValues
            title: post?.title || "",
            slug: post?.$id || "",      //slug is nothing but we are converting title into slug(by replacing " " -> "-" and it is used as a DOCUMENT_ID in database)
            content: post?.content || "",
            status: post?.status || "active",
        },
    });


    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    // console.log(userData)
    console.log("user id:",userData["$id"])
    
    const submit = async (data) => {    //data is the entire data of form 

        if (post) {     //edit post
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;    //upload the updated image

            if (file) {
                appwriteService.deleteFile(post.featuredImage); //delete previous image
            }
            console.log("post id:",data)
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {

                navigate(`/post/${dbPost.$id}`);
            }
        } else { 
               
            console.log(data)
        
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}     
                    //function is used to register an input element (like an HTML input, select, or textarea) with the form
                    //it tells the library to keep track of the input's value and validity. just like we provide pattern, required:true


                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.target.value), { shouldValidate: true });
                    }}
                    readOnly={true}
                />
                <RTE label="Content :"    name="content" control={control} defaultValue={getValues("content")}  />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={ `${appwriteService.getFilePreview(post.featuredImage)}`}
                            alt="img"
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}