import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true


    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6

        //for local sign up

    },
    googleId:{
        type:String,
        //for google sign up


    }
    ,favorites:{
        type:[String],
        default:[]
    }
},{timestamps:true})

export default mongoose.model("User",userSchema)

