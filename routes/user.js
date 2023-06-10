const router = require('express').Router();
const User = require('../models/User');
const Posts = require('../models/Posts');
const Followers = require('../models/Followers');
const Following = require('../models/Following');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken');









//`````````````````````````````````````````````````Get Followers List```````````````````````````````````````````````````````










router.get('/:id/followers', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const foundFollowers = await Followers.findOne({ id: req.params.id });
        if (foundFollowers) {

            res.status(200).json(foundFollowers.followers);
        }
        else {
            res.status(404).json("Not found");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})









//``````````````````````````````````````````````````Get Following List```````````````````````````````````````````````````````











router.get('/:id/following', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const foundFollowing = await Following.findOne({ id: req.params.id });
        if (foundFollowing) {

            res.status(200).json(foundFollowing.following);
        }
        else {
            res.status(404).json("Not found");
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
})










//`````````````````````````````````````````````````````````ALL POSTS```````````````````````````````````````````````````









router.get('/:id/posts', verifyTokenAndAuthorization, async function (req, res) {
    try {
        // const foundUser = await User.findById(req.params.id);
        const foundPosts = await Posts.find({ id: req.params.id });
        if (!foundPosts) {
            res.status(404).json("Posts not found");
        }
        else {
            res.status(201).json(foundPosts.posts);
        }

    }
    catch (err) {
        console.log(err);
    }

});









//   `````````````````````````````````````````````````````` NEW POST``````````````````````````````````````````````````````````








router.put('/:id/newpost', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const newpost = req.body;
        console.log(newpost);
        const savedPost = await Posts.updateOne({ id: req.params.id }, { $addToSet: { "posts": newpost } }, { upsert: true });
        console.log(savedPost);
        res.status(201).json(savedPost);
    }
    catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
})










//````````````````````````````````````````````````````````Follow A User````````````````````````````````````````````````````









router.put('/:id/follow/:user', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const usertobefollowed = await User.find({ username: req.params.user });
        const user = await User.findById(req.params.id);
        // console.log(user);
        const username = usertobefollowed[0].username;
        const profilePic = usertobefollowed[0].profilePicture;
        const obj = { username, profilePic };
        const username1 = user.username;
        const profilePic1 = user.profilePicture;
        const obj1 = { username: username1, profilePic: profilePic1 };
        // console.log(obj1);
        const addedFollowing = await Following.updateOne({ id: req.params.id }, { $push: { "following": obj } }, { upsert: true });
        const addedFollower = await Followers.updateOne({ username: req.params.user }, { $push: { "followers": obj1 } }, { upsert: true });
        // console.log(addedFollower);
        res.status(201).json({ addedFollower, addedFollowing });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})




//```````````````````````````````````````````````````Unfollow````````````````````````````````````````````````````````````````




router.put('/:id/unfollow/:username', verifyTokenAndAuthorization, async function (req, res) {

    try {
        const myuser = await User.findById(req.params.id);
        const youuser = await User.find({ username: req.params.username });
        const removedFollowing = await Following.updateOne({ id: req.params.id }, { $pull: { "following": { username: req.params.username } } });
        const removedFollower = await Followers.updateOne({ id: youuser[0]._id }, { $pull: { 'followers': { username: myuser.username } } });
        res.status(204).json("Removed Successfully");


    }
    catch (err) {
        res.status(500).json(err);
    }

})




//````````````````````````````````````````````````````Get All Users````````````````````````````````````````````````````````````










router.get('/:id/finduser', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const foundUsers = await User.find();
        if (foundUsers) {
            const { password, ...others } = foundUsers._doc;
            res.status(200).json(...others);
        }
        else {
            res.status(404).json("No Users Found");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})







//````````````````````````````````````````````````````Follower or not``````````````````````````````````````````````````````````````````









// // this endpoint tells if the username is followed by id or not

// router.get('/:id/isFollower/:username', verifyTokenAndAuthorization, async function (req, res) {
//     try {
//         const foundUser = await User.findById(req.params.id);
//         const foundFollowing = await Following.find({ id: req.params.id });
//         if (foundFollowing) {

//             if (foundUser.username === req.params.username) {
//                 res.status(200).json(2);
//             }
//             else {

//                 var returnvalue = false;

//                 var array = foundFollowing[0].following;

//                 for (var i = 0; i < array.length; i++) {
//                     if (array[i].username === req.params.username) {
//                         returnvalue = true;
//                     }
//                 }
//                 res.status(200).json(returnvalue);

//             }
//         }
//         else {
//             res.status(404).json("Not found");
//         }
//     }
//     catch (err) {
//         res.status(500).json(err);
//     }
// })









//`````````````````````````````````````````````````Get profile details of a user```````````````````````````````````````````````````````````













router.get('/:id/:user', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        const foundUser = (await User.find({ username: req.params.user }))[0];
        const foundPosts = (await Posts.find({ id: foundUser._id }));
        const foundFollowers = (await Followers.find({ id: foundUser._id }));
        const foundFollowing = (await Following.find({ id: foundUser._id }));
        var isFollower = false;
        if (user.username === req.params.user) {
            isFollower = 2;
        }
        else {

            var array = foundFollowing;

            for (var i = 0; i < array.length; i++) {
                if (array[i].username === req.params.user) {
                    isFollower = true;
                    break;
                }
            }
        }
        const numPosts = foundPosts[0].posts.length;
        const numFollowers = foundFollowers[0].followers.length;
        const numFollowing = foundFollowing[0].following.length;
        const { password, ...others } = foundUser._doc;
        if (foundUser && foundPosts && foundFollowers && foundFollowing) {

            res.status(200).json(
                {
                    ...others,
                    followers: foundFollowers,
                    numfollowers: numFollowers,
                    following: foundFollowing,
                    numfollowing: numFollowing,
                    posts: foundPosts,
                    numposts: numPosts,
                    isFollower: isFollower,
                });
        }

        else {
            res.status(404).json("Not found");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})










// ```````````````````````````````````````````````````Update Profile ```````````````````````````````````````````````````````













router.put('/:id/profile/update', verifyTokenAndAuthorization, async function (req, res) {
    try {
        const updatedata = req.body;
        const updatedUser = await User.updateOne({ _id: req.params.id }, updatedata, { upsert: true });
        console.log(updatedUser);
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json(err);
    }
})




module.exports = router;