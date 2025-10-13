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


export {postRegister, getUsers ,getBlogs,postBlogs ,getlogin ,getBlog, userBlogs, deleteBlog};