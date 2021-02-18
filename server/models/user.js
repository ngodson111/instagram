const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
        default:"https://i.stack.imgur.com/34AD2.jpg"
    },
    followers:[
        {
            id:ObjectId,
            username:String,
            profilepic:String
        }
    ],
    following:[
        {
            id:ObjectId,
            username:String,
            profilepic:String
        }
    ]
})

mongoose.model('User', userSchema)