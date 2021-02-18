const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requirelogin = require('../middleware/requirelogin')

//route1 create post
router.post('/serverside/post/createpost', requirelogin, (req, res) => {
    const { title, Url, time } = req.body
    req.user.password = undefined
    const post = new Post({
        title,
        photo:Url,
        postedby:req.user,
        time,
    })
    post.save()
    .then(result => {
        res.json({message:"Upload Success"})
    })
    .catch(err => {
        console.log(err)
    })
})

//route2 viewpost me
router.get('/profile/post', requirelogin, (req, res) => {
    const id = req.user._id
    Post.find({ postedby:id })
    .populate("postedby", "_id name")
    .then(data => {
        res.json({data})
    })
    .catch(err => {
        console.log(err)
    })
})
//route2 sub delete own post
router.get('/profile/postdelete/:id', requirelogin, (req,res) => {
    Post.findByIdAndDelete(
        { _id:req.params.id }
    )
    .then (response => {
        res.json({message:"Post Deleted Successfully!"})
    })
    .catch(err => {
        console.log(err)
    })
})

//route3 viewpost all
router.get('/post/allpost', requirelogin, (req, res) => {
    Post.find()
    .populate("postedby", "_id name profilepic username")
    .then(data => {
        res.json({data})
    })
    .catch(err => {
        console.log(err)
    })
})
//route3 sub like 
router.get('/post/like/:id', requirelogin, (req,res) => {
    Post.findByIdAndUpdate(req.params.id,{
        $push: {like:{
            id:req.user._id,
            username:req.user.username,
            profilepic:req.user.profilepic
        }}
    },
    {
        new: true
    }).exec((err,result) => {
        if(result) {
            res.json({message:"Liked"})
        }
        else {
            res.json({error:"Error"})
        }
    })
})
//route3 sub unlike
router.get('/post/unlike/:id', requirelogin, (req,res) => {
    Post.findByIdAndUpdate(req.params.id,{
        $pull: {like:{
            id:req.user._id,
            username:req.user.username,
            profilepic:req.user.profilepic
        }}
    },
    {
        new: true
    }).exec((err,result) => {
        if(result) {
            res.json({message:"unLiked"})
        }
        else {
            res.json({error:"Error"})
        }
    })
})
//route3 sub comment post
router.post('/post/comment', requirelogin, (req,res) => {
    const {id,comment} = req.body
    Post.findByIdAndUpdate(
        { _id : id },
        {
            $push: {comment:{
                id: req.user._id,
                username:req.user.username,
                profilepic:req.user.profilepic,
                comment
            }}
        },
        {
            new:true
        }
    )
    .exec((err,result) => {
        if(result) {
            res.json({message:"Commented"})
        }
        else {
            res.json({error:"Error"})
        }
    })
})

//route4 user profile post
router.get('/serverside/postdetails/:id', requirelogin, (req,res) => {
    Post.find({ postedby : req.params.id })
    .populate("postedby", "_id username profilepic")
    .then(post => {
        res.json({post})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router