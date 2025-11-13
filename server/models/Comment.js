import mongoose from "mongoose";
import { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {type: String, required: true},
    blogId: {type: Schema.Types.ObjectId, ref: "Blog", required: true},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    createdAt: {type: Date, default: Date.now}
});

const Comment = mongoose.model("Comment", commentSchema);

export { Comment };