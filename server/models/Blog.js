import {Model, Schema} from "mongoose";
import mongoose from "mongoose";

const blogSchema=new Schema({
    title:{type:String ,required:true},
    content:{type:String ,required:true},
    authorId:{type:Schema.Types.ObjectId ,ref:"User",required:true},
    createdAt:{type:Date ,default:Date.now}
})
const Blog=mongoose.model("Blog",blogSchema);

export {Blog};