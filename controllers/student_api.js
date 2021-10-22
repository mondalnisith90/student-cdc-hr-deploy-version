const express = require("express");
const HRModel = require("../models/hr_model");
const router = express.Router();
const StudentModel = require('../models/student_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const studentUserAuth = require('../userauth/studentUserAuth');
const mongoose = require('mongoose');


router.get("/viewall", async (req, res)=>{
    //View all users
    try {
        const dbResponse = await StudentModel.find({});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("Data not found. Error: "+error.message);
    }
});

router.get("/search/:sid", async (req, res)=> {
    //Search user by Id
    const studentId = req.params.sid;
    try {
        const dbResponse = await StudentModel.findById(studentId);
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("Invalid syudent Id");
    }
});


router.get("/get-profile", studentUserAuth, async (req, res)=> {
    try {
        res.status(200).json(req.userData);
    } catch (error) {
        res.status(400).json("Invalid student Id");
    }
});


router.get("/search/value/:data", async (req, res)=> {
    //Search user by Id
    const data = req.params.data.trim();
    try {
        let dbResponse = "";
        if(data != "all_documents"){
        dbResponse = await StudentModel.find({$or: [{name:{'$regex' : data, '$options' : 'i'}}, {branch:{'$regex' : data, '$options' : 'i'}}, {course:{'$regex' : data, '$options' : 'i'}}, {skills: {$elemMatch: {$regex: data, $options: 'i'}}}]});
        }else{
            dbResponse = await StudentModel.find({});
        }
     res.status(200).json(dbResponse);
        } catch (error) {
            console.log(error.message)
            res.status(400).json("Name not found");
    }
});



router.get("/search/branch/:name", async (req, res)=> {
    //Search user by branch name
    const studentBranch = req.params.name.toUpperCase();
    try {
        const dbResponse = await StudentModel.find({branch:{'$regex' : studentBranch, '$options' : 'i'}});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("Invalid branch name");
    }
});


router.get("/search/skills/:name", async (req, res)=> {
    //Search user by skills
    const skills = req.params.name;
    try {
        const dbResponse = await StudentModel.find({skills: {$in: [skills]}});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("Not found, Error: "+error.message);
    }
});


router.post("/signup", async (req, res)=>{
    const clientData = req.body;
    try {
        if(!clientData.name || !clientData.course || !clientData.branch || !clientData.email || !clientData.password || !clientData.phoneNumber || !clientData.type){
            res.status(420).json("Please fill the input fields properly");
        }else{
            try {
                const newStudent = new StudentModel(clientData);
                const dbResponse = await newStudent.save();
                console.log(dbResponse);
                res.status(201).json(dbResponse);
            } catch (error) {
                res.status(400).json("User Registration failed. Error: "+error.message);
            }
        }
    } catch (error) {
        res.status(400).json("User Registration failed. Error: "+error.message);
    }  
});



router.post("/signin", async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(420).json("Please fill input fields properly.");
    }else{
        try {
            const dbResponse = await StudentModel.findOne({email});
            if(dbResponse){
                const isPasswordMatched = await bcrypt.compare(password, dbResponse.password);
                if(isPasswordMatched){
                    //Means password is mached
                    //Set JWT Token
                    const jwtToken = await dbResponse.getJwtToken();
                    res.cookie("user_key", jwtToken, {expires: (new Date(Date.now() + 5184000000)), httpOnly: true});
                    // res.cookie("user_type", "student", {expires: (new Date(Date.now() + 5184000000)), httpOnly: true});
                    res.status(200).json(dbResponse);
                }else{
                    throw new Error();
                }
               
            }else{
                throw new Error();
            }
        } catch (error) {
            res.status(400).json("Invalid login credential. "+error.message);
        }
    }
});


router.put("/update/:sid", studentUserAuth, async (req, res)=>{
    const studentId = req.params.sid;
    const clientData = req.body;
    try {
        const dbResponse = await StudentModel.findByIdAndUpdate(studentId, clientData, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});


router.put("/skills/update", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const skill = req.body.skill;
    try {
        const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$push: {skills: skill}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});

router.put("/skills/delete", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const skill = req.body.skill;
    try {
        const response = await StudentModel.findOne({_id: studentId, skills: {$in: [skill]}});
        if(response){
            //If skill is present in skills array
            const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$pull: {skills: skill}}, {new: true});
            res.status(200).json(dbResponse);
        }else{
            //If skill is not present in skills array
            res.status(400).json("Skill not found.");
        }
       
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});


router.put("/educations/add", studentUserAuth, async (req, res)=>{
    // const studentId = r+;
    const studentId = req.userData._id;
    const education = req.body.education;
    education._id = Date.now();
    try {
        const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$push: {education: education}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});


router.put("/educations/update", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const education = req.body.education;
    
    try {
        const dbResponse = await StudentModel.findOneAndUpdate({_id: studentId, "education._id": education._id}, {$set: {"education.$": education}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});


router.put("/educations/delete", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const educationDetails = req.body.educationDetails;
    try {
        const response = await StudentModel.findOne({_id: studentId, "education._id": educationDetails._id});
        if(response){
            //Means education data is present in database
            const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$pull: {education: educationDetails}}, {new: true});
            res.status(200).json(dbResponse);
        }else{
            res.status(400).json("Education details not deleted.");
        }
       
    } catch (error) {
        console.log(error.message)
        res.status(400).json("User not delete. Invalid student id");
    }
});


router.put("/projects/add", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const project = req.body.project;
    project._id = Date.now();
    console.log();
    try {
        const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$push: {projects: project}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});


router.put("/projects/update", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const project = req.body.project;
    try {
        const dbResponse = await StudentModel.findOneAndUpdate({_id: studentId, "projects._id": project._id}, {$set: {"projects.$": project}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});



router.put("/projects/delete", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const projectDetails = req.body.projectDetails;
    console.log(projectDetails)
    try {
        const response = await StudentModel.findOne({_id: studentId, "projects._id": projectDetails._id});
        if(response){
            //Means education data is present in database
            const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$pull: {projects: projectDetails}}, {new: true});
            res.status(200).json(dbResponse);
        }else{
            res.status(400).json("Project details not deleted.");
        }
       
    } catch (error) {
        console.log(error.message)
        res.status(400).json("User not delete. Invalid student id");
    }
});


router.put("/work-experiences/add", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const workExprience = req.body.workExprience;
    workExprience._id = Date.now();
    try {
        const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$push: {workExprience: workExprience}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});



router.put("/work-experiences/update", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const workExprience = req.body.workExprience;
    console.log(workExprience)
    try {
        const dbResponse = await StudentModel.findOneAndUpdate({_id: studentId, "workExprience._id": workExprience._id}, {$set: {"workExprience.$": workExprience}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});



router.put("/work-experiences/delete", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const workExprienceDetails = req.body.workExprienceDetails;
    try {
        const response = await StudentModel.findOne({_id: studentId, "workExprience._id": workExprienceDetails._id});
        if(response){
            //Means work experience data is present in database
            const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$pull: {workExprience: workExprienceDetails}}, {new: true});
            res.status(200).json(dbResponse);
        }else{
            res.status(400).json("Experience details not deleted.");
        }
       
    } catch (error) {
        console.log(error.message)
        res.status(400).json("User not delete. Invalid student id");
    }
});



router.put("/languages/add", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const language = req.body.language;
    language._id = Date.now();
    try {
        const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$push: {languages: language}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});


router.put("/languages/update", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const language = req.body.language;
    try {
        const dbResponse = await StudentModel.findOneAndUpdate({_id: studentId, "languages._id": language._id}, {$set: {"languages.$": language}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});



router.put("/languages/delete", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const languageDetails = req.body.languageDetails;
    try {
        const response = await StudentModel.findOne({_id: studentId, "languages._id": languageDetails._id});
        if(response){
            //Means education data is present in database
            const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$pull: {languages: languageDetails}}, {new: true});
            res.status(200).json(dbResponse);
        }else{
            res.status(400).json("Language not found.");
        }
       
    } catch (error) {
        console.log(error.message)
        res.status(400).json("User not delete. Invalid student id");
    }
});



router.put("/field-of-interest/add", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const fieldOfInterest = req.body.fieldOfInterest;
    try {
        const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$push: {fieldsOfInterest: fieldOfInterest}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});



router.put("/field-of-interest/delete", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const fieldsOfInterest = req.body.fieldsOfInterest;
    try {
        const response = await StudentModel.findOne({_id: studentId, fieldsOfInterest: {$in: [fieldsOfInterest]}});
        if(response){
            //If skill is present in skills array
            const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$pull: {fieldsOfInterest: fieldsOfInterest}}, {new: true});
            res.status(200).json(dbResponse);
        }else{
            //If skill is not present in skills array
            res.status(400).json("Skill not found.");
        }
       
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});


router.put("/video-url/add", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const videoUrl = req.body.videoUrl;
    videoUrl._id = Date.now();
    try {
        const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$push: {videoUrl: videoUrl}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("User not update. Invalid student id");
    }
});



router.put("/video-url/delete", studentUserAuth, async (req, res)=>{
    // const studentId = req.params.sid;
    const studentId = req.userData._id;
    const videoDeatils = req.body.videoDeatils;
    try {
        const response = await StudentModel.findOne({_id: studentId, "videoUrl._id": videoDeatils._id});
        if(response){
            //Means education data is present in database
            const dbResponse = await StudentModel.findByIdAndUpdate(studentId, {$pull: {videoUrl: videoDeatils}}, {new: true});
            res.status(200).json(dbResponse);
        }else{
            res.status(400).json("Video not found.");
        }
       
    } catch (error) {
        console.log(error.message)
        res.status(400).json("User not delete. Invalid student id");
    }
});



router.delete("/delete/:sid", async (req, res)=>{
    const studentId = req.params.sid;
    try {
        const dbResponse = await StudentModel.findByIdAndDelete(studentId);
       console.log(dbResponse);
       if(dbResponse){
        res.status(200).json("Profile deleted successfully.");
       }else{
           throw new Error();
       }
    } catch (error) {
        res.status(400).json("Invalid student Id.");
    }
});


router.get("/logout", studentUserAuth, (req, res)=>{
    try {
        res.clearCookie("user_key");
        res.clearCookie("user_type");
        res.status(200).json("User logout successfully."); 
    } catch (error) {
        res.status(400).json("Invalid user, Error: "+error.message);
    }

});





module.exports = router;