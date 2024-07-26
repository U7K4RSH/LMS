const mongoose1 = require("mongoose");
const bookSchema = new mongoose1.Schema(
    {
        Code:{
            type:String,
            required:true,
            unique:true,
        },
        Title:{
            type:String,
            required:true,
        },
        Author:{
            type:String,
            required:true,
            // unique:true,
        },
        Description:{
            type:String,    
            required:true,
            // unique:true,
        },
        Alloted:{
            type:Boolean,
            default:false,
        },
        StCode:{
            type:String,
        },
    }
)

const Register2 = new mongoose1.model("Register2", bookSchema);
module.exports = Register2;