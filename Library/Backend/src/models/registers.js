const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema(
    {
        ID:{
            type:String,
            required:true,
            unique:true,
        },
        Name:{
            type:String,
            required:true,
        },
        Email:{
            type:String,
            required:true,
            unique:true,
        },
        Phone:{
            type:Number,    
            required:true,
            unique:true,
        },
        books: [{ type: String }],
    }
)

const Register = new mongoose.model("Register", studentSchema);
module.exports = Register;