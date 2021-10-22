const express = require('express');
const router = express.Router();
const HRModel = require('../models/hr_model');
const bcrypt = require('bcryptjs');
const hrUserAuth = require('../userauth/hrUserAuth');


router.get("/viewall", async (req, res)=>{
    try {
        const dbResponse = await HRModel.find({});
        if(dbResponse){
            res.status(200).json(dbResponse);
        }else{
            throw new Error();
        }
        
    } catch (error) {
        res.status(400).json("Data not found, Error: "+error.message);
    }
});

router.get("/search/:hrid", async  (req, res)=>{
    const hrId = req.params.hrid;
    try {
        const dbResponse = await HRModel.findById(hrId);
        console.log(dbResponse)
        if(dbResponse){
            res.status(200).json(dbResponse);
        }else{
            throw new Error();
        }
        
    } catch (error) {
        res.status(400).json("Invalid HR id");
    }
});



router.get("/get-profile", hrUserAuth, async (req, res)=> {
    try {
        res.status(200).json(req.userData);
    } catch (error) {
        res.status(400).json("Invalid HR Id");
    }
});


router.get("/search/value/:data", async (req, res)=> {
    const data = req.params.data.trim();
    try {
        let dbResponse = "";
        if(data != "all_documents"){
        dbResponse = await HRModel.find( {$and: [ {$or: [{name:{'$regex' : data, '$options' : 'i'}}, {companyName:{'$regex' : data, '$options' : 'i'}}, {email:{'$regex' : data, '$options' : 'i'}}]}, {isGranted: "true"}]});
        }else{
            dbResponse = await HRModel.find({});
        }
     res.status(200).json(dbResponse);
        } catch (error) {
            console.log(error.message)
            res.status(400).json("Name not found");
    }
});



router.get("/search/company-name/:name", async  (req, res)=>{
    const companyName = req.params.name;
    try {
        const dbResponse = await HRModel.find({companyName});
        console.log(dbResponse)
        res.status(200).json(dbResponse);
    } catch (error) {
        console.log(error.message)
        res.status(400).json("No HR found.");
    }
});


router.post("/signup", async (req, res)=>{
    const clientData = req.body;
    console.log(clientData)
    try {
        if(!clientData.name || !clientData.companyName || !clientData.email || !clientData.password || !clientData.phoneNumber || !clientData.type){
            res.status(420).json("Please fill the input fields properly");
        }else{
            try {
                const newHR = new HRModel(clientData);
                const dbResponse = await newHR.save();
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
            const dbResponse = await HRModel.findOne({email});
            if(dbResponse){
                const isPasswordMatched = await bcrypt.compare(password, dbResponse.password);
                if(isPasswordMatched){
                    //Means password is mached
                    if(dbResponse.isGranted=="true"){
                       //Set JWT Token
                       const jwtToken = await dbResponse.getJwtToken();
                       res.cookie("user_key", jwtToken, {expires: (new Date(Date.now() + 5184000000)), httpOnly: true});
                       res.status(200).json(dbResponse);
                    }else{
                        res.status(200).json(dbResponse);
                    }
                }else{
                    throw new Error();
                }
            }else{
                throw new Error();
            }
        } catch (error) {
            res.status(400).json("Invalid login credential.");
        }
    }
});


router.put("/update-profile", hrUserAuth, async (req, res)=>{
    const hrId = req.userData._id;
    const hrProfileData = req.body;
    try {
        const dbResponse = await HRModel.findByIdAndUpdate(hrId, hrProfileData, {new: true});
        if(dbResponse){
            res.status(200).json(dbResponse);
        }else{
            throw new Error();
        }
    } catch (error) {
        res.status(401).json("You are not authorized to edit this profile.");
    }
});


router.put("/isgranted/update/:hrid", async (req, res)=>{
    const hrId = req.params.hrid;
    const isGranted = req.body.isGranted;
    console.log(hrId, isGranted);
    try {
        const dbResponse = await HRModel.findByIdAndUpdate(hrId, {isGranted}, {new: true});
        console.log(dbResponse);
        if(dbResponse){
            res.status(200).json(dbResponse);
        }else{
            throw new Error();
        }
    } catch (error) {
        res.status(400).json("User not update. Invalid HR id");
        console.log(error.message)
    }
});



router.put("/add-student-profile", hrUserAuth, async (req, res)=>{
    // const hrid = req.params.hrid; 
    const hrid = req.userData._id;
    const studentId = req.body.studentId;
    try {
        const dbResponse = await HRModel.findByIdAndUpdate(hrid, {$push: {sortlistedProfiles: studentId}}, {new: true});
        res.status(200).json(dbResponse);
    } catch (error) {
        res.status(400).json("Student profile not add.")
    }
});



router.put("/sortlisted-profile/student/delete", hrUserAuth, async (req, res)=>{
    const hrid = req.userData._id;
    const studentId = req.body.studentId;
    try {
        const response = await HRModel.findOne({_id: hrid, sortlistedProfiles: {$in: [studentId]}});
        if(response){
            //If studentId is present in sortlistedProfiles array
            const dbResponse = await HRModel.findByIdAndUpdate(hrid, {$pull: {sortlistedProfiles: studentId}}, {new: true});
            res.status(200).json(dbResponse);
        }else{
            //If studentId is not present in sortlistedProfiles array
            res.status(400).json("Invalid item id");
        }
       
    } catch (error) {
        res.status(400).json("Item not delete. Invalid item id");
    }
});


router.delete("/delete/:hrid", async (req, res)=>{
    const hrId = req.params.hrid;
    try {
        const dbResponse = await HRModel.findByIdAndDelete(hrId);
        if(dbResponse){
            res.status(200).json("Profile deleted successfully.");
        }else{
            throw new Error();
        }
    } catch (error) {
        res.status(400).json("Invalid HR id.");
    }
});



router.get("/logout", hrUserAuth, (req, res)=>{
    try {
        res.clearCookie("user_key");
        res.clearCookie("user_type");
        res.status(200).json("User logout successfully."); 
    } catch (error) {
        res.status(400).json("Invalid user, Error: "+error.message);
    }
});



module.exports = router;