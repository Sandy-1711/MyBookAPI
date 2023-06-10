const mongoose = require('mongoose');
const FollowersSchema = new mongoose.Schema({
    username: { type: String, required: true },
    id: { type: String, required: true },
    followers: [{
        username: {type:String,unique:true},
        profilePic:String,
    }]
}, { timestamps: true });
module.exports = mongoose.model("Follower", FollowersSchema);