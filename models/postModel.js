import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User is required."]
    },
    timestamp: {
        type: String
    },
    // One of Message, files & link are required, see pre-validator below.
    message: {
        type: String
    },
    files: {
        type: [String]
    },
    link: {
        String
    },
    retweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    mentions: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
    },
    tags: {
        type: [String]
    }
});

// Ensure one of message/files/links are present before validation starts.
postSchema.pre('validate', next => {
    const that = this;
    const postContentTypes = ["message", "files", "links"]
    const hasContent = postContentTypes.some(type => that.hasOwnProperty(type));
    return hasContent ? next() : next(new Error("No post content provided."));
});

const Post = mongoose.model("Post", postSchema)

export default Post;