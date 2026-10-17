
import mongoose from "mongoose";

const urlschema =new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true
    },
    redirectURL:{
        type:String,
        required:true,
    },
    visitHistory:[{timeStamp:{type:Number}}]
},
{timestamps:true} 
)

export const URL=mongoose.model("URL",urlschema)
