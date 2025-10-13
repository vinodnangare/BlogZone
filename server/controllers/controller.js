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


const getUsers=async(req,res)=>{
    try{
        const users=await User.find()
        res.json({
            sucess:true,
            data: users
        });
}
catch(e){
    res.json({
        sucess:false,
        message:"Failed to fetch users"
    });
}
}


const postBlogs=async(req,res)=>{

    const {title,content,authorId}=req.body;
    try{

     
        const user=await User.findById(authorId);
        if(!user){  
            return res.json({
                sucess:false,
                message:"Author not found"
            });
        }
        const blog={
            title,content,authorId
        };
       const saveblog= await new Blog(blog).save();
        res.json((  

            {
                "message":"Blog Created Successfully",
            }
        ));
    }
    catch(e){
        res.json({
            sucess:false,
            message:"Failed to create blog"
        });
    }
};  


const getBlogs=async(req,res)=>{
    try{
        const blogs=await Blog.find().populate("authorId","username email -_id")    
        res.json({
            sucess:true,
            data: blogs
        });
}   
catch(e){
    res.json({
        sucess:false,
        message:"Failed to fetch blogs"
    });
}
}

const getBlog=async(req,res)=>{
    
    const {id}=req.params;
  
    try{
        const blog = await Blog.findById(id).populate("authorId","username email -_id");
        if(!blog){
            return res.json({
                sucess:false,
                message:"Blog Not Found"
            });
        }
        res.json({
            sucess:true,
            data: blog,
            comments: await comment.find({blogId:blog._id}).select("-blogId -__v -createdAt -updatedAt")
            
        });
    }
    catch(e){
        res.json({
            sucess:false,
            message:"Failed to fetch blog"
        });
    }


}

const userBlogs=async(req,res)=>{
    const {id}=req.params;
    try{
        const blogs=await Blog.find({authorId:id}).populate("authorId","username email -_id")    
        res.json({
            sucess:true,
            data: blogs
        });
}
catch(e){
    res.json({
        sucess:false,
        message:"Failed to fetch blogs of user"
    });
}   
}



export {postRegister, getUsers ,getBlogs,postBlogs ,getlogin ,getBlog, userBlogs, deleteBlog};