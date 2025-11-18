// api/models/Post.js  (ESM)

import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    author: { type: String },
    createdAt: { type: Date, default: Date.now },

    // For 2-line / 4-line posts:
    lines: [{ type: String }],

    // For long content:
    body: { type: String },

    // Books:
    title: { type: String },
    coverImageUrl: { type: String },   // existing for books
    downloadUrl: { type: String },
    previewUrl: { type: String },
    pages: { type: Number },

    // Slug:
    slug: { type: String, lowercase: true, trim: true },

    /*
      New / additional image fields to match frontend names.
      These are optional strings (URLs). Add as many as the admin form uses.
    */
    headerImageUrl: { type: String },   // common header image (used in sehat etc)
    bodyImageUrl1: { type: String },
    bodyImageUrl2: { type: String },
    bodyImageUrl3: { type: String },
    imageUrl: { type: String },         // generic fallback
    // you can add others if frontend uses different names
  },
  { timestamps: false }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
