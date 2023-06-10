const {verify}=require('jsonwebtoken');
const User = require('../models/User');
const router = require('express').Router();
const Followers = require('../models/Followers');
const Following = require('../models/Following');
const Posts = require('../models/Posts');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
router.post('/signup', async function (req, res) {
    const newuser = new User({
        username: req.body.username,
        email: req.body.email,
        password: cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC.toString()),

        profilePicture: req.body.profilePicture,
        bio: req.body.bio,
    });
    try{
        const savedUser=await newuser.save();
        const defaultFollower=new Followers({
            username:savedUser.username,
            id:savedUser._id,
            followers:[]
        })
        await defaultFollower.save();
        const defaultFollowing=new Following({
            username:savedUser.username,
            id:savedUser._id,
            following:[]
        })
        await defaultFollowing.save();
        const defaultPosts=new Posts({
            id:savedUser._id,
            posts:[]
        })
        await defaultPosts.save();
        const {password,...others}=savedUser._doc;
        res.status(201).json({...others});
        
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json(err);
    }
});
router.post('/login', async function (req, res) {
    try{
        const user=await User.findOne({username:req.body.username});
        if(!user)
        {
            res.status(401).json("user not found");
        }
        const hashedpassword=cryptoJS.AES.decrypt(user.password,process.env.PASS_SEC);
        const password=hashedpassword.toString(cryptoJS.enc.Utf8);
        if(password===req.body.password)
        {
            const token=jwt.sign({username:user.username,id:user._id,isAdmin:user.isAdmin},process.env.JWT_SEC,{expiresIn:'1d'});
            const {password,...others}=user._doc;
            res.status(200).json({...others,token});
        }
        else
        {
            res.status(401).json("Wrong password");
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json(err);
    }
})
module.exports=router;