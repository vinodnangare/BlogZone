import {User} from './../models/User.js';
import {Blog} from './../models/Blog.js';
import {comment} from './../models/Comment.js';
const postRegister=async(req,res)=>{
   
    const {username, email,password}=req.body;

    try{
    const user={
        username,email,password
    };

   const saveuser=  await new User(user).save();
    res.json((
        {
           "message":"User Registered Successfully",  
        }
    ));
    }
    catch{
        res.send("Error While Registering User");
    }
};



const getlogin=async(req,res)=>{
    const {email,password}=req.body;

    try{
        const user=await User
        .findOne({email:email,password:password})
        .select("-password -__v -createdAt -updatedAt");
        if(!user){
            return res.json({
                sucess:false,
                message:"User Not Found"
            });
        }
        res.json({
            sucess:true,
            data:user,
            blogsPostedByUser: await Blog.find({authorId:user._id}).select("-authorId -__v -createdAt -updatedAt")
        });
    }   
    catch(e){
        res.json({
            sucess:false,
            message:"Login Failed"
        });
    }

}


export {postRegister, getUsers ,getBlogs,postBlogs ,getlogin ,getBlog, userBlogs, deleteBlog};