import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { 
      type: String, 
      enum: ["Technology", "Health", "Education", "Travel", "Animal", "Lifestyle", "Business", "Other"],
      default: "Technology" 
    },
    state: { type: String, enum: ["draft", "published"], default: "draft" },
    createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);
export { Blog };