const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        default:null
    },
    photo:{
        type:String,
        required:true
    },
    postedby:{
        type:ObjectId,
        ref:"User"
    },
    comment:[
        {
            id:ObjectId,
            username:String,
            profilepic:String,
            comment:String
        }
    ],
    like:[{
        id: ObjectId,
        username:String,
        profilepic:String
    }],
    time:{
        type:String,
        required:true
    }
})

mongoose.model("Post", postSchema)