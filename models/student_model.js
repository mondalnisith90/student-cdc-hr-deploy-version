const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: [20, "Name size must be of 20 characters."],
        minlength: [3, "Name length must be at least of 3 characters"]
    },
    branch: {
        type: String,
        required: true
    },
    course: {
        type: String, 
        required: true
    },
    profile_pic: {
        type: String,
        default: "default"
    },
    email: {
        type: String,
        required: true,
        unique: [true, "This email id already exists."],
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address.");
            }
        }
    },
    password: {
        type: String,
        trim: true,
        minlength: [6, "Password size must be atleast of 6 character."],
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        validate(value){
            let p = ""+value;
            if(p.length!=10){
                throw new Error("Phone Number size must be of 10 digits.")
            }
        }
    },
    address: {
        type: String,
        default: "none"
    },
    linkedinLink: {
        type: String,
        default: "none"
    },

    carrierObjective: {
        type: String,
        default: "none"
    },
    education: {
        type: [{}]
    },
    workExprience: {
        type: [{}]
    },
    projects: {
        type: [{}]
    },
    extraActivities: {
        type: [{}]
    },
    skills: {
        type: []
    },
    languages: {
        type: [{}]
    },
    fieldsOfInterest: {
        type: []
    },
    videoUrl: {
        type: []
    },
    type: {
        type: String,
        default: "student",
        required: true
    },
    jwtToken: {
        type: String,
        default: null
    }
});



studentSchema.pre("save", async function (req, res, next){
    //perform Password hashing
        if(this.isModified("password")){
            try {
                const bycryptPassword = await bcrypt.hash(this.password, 12);
                this.password = bycryptPassword;
                next();
            } catch (error) {
                throw new Error("Server Error");
            }
        }
    });


studentSchema.methods.getJwtToken = async function(){
    //Create jwt token
    try {
        const jwtToken = await jwt.sign({userId: this._id}, process.env.JWT_SECRET_KEY);
        this.jwtToken = jwtToken;
        await this.save();
        return jwtToken;
    } catch (error) {
        console.log(error.message)
        throw new Error();
    }
}





const studentModel = mongoose.model("student_model", studentSchema);





module.exports = studentModel;