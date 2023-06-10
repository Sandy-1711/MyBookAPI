const mongoose = require('mongoose');
const FollowingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    id: { type: String, required: true },
    following: [{
        username: {type:String,unique:true},
        profilePic:String,
    }]
}, { timestamps: true })
module.exports = mongoose.model('Following', FollowingSchema);