import {Schema, Model} from "mongoose";
import mongoose from "mongoose";

const userSchema=new Schema({
    username:{type:String ,required:true,unique:true},
    email:{type:String ,required:true,unique:true},
    password:{type:String ,required:true},
    createdAt:{type:Date ,default:Date.now}
})
const User=mongoose.model("User",userSchema);

export {User};