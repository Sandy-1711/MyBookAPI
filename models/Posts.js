const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    posts: [{
        postid:String,
        image:String,
        caption:String,
        comments:[{
            userid:String,
            mycomment:String,
        }],
        likes:[{
            userid:String,
        }]
    }]
},{timestamps:true})
module.exports=mongoose.model('Post',PostSchema);