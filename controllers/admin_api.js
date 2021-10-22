const AdminModel = require('../models/admin_model');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


router.post("/signin", async (req, res)=>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
            res.status(420).json("Please fill input fields properly.");
        }else{
            const dbResponse = await AdminModel.findOne({email});
            if(dbResponse){
                const isPasswordMatched = await bcrypt.compare(password, dbResponse.password);
                if(isPasswordMatched){
                    //Means password is mached
                    res.status(200).json(dbResponse);
                }else{
                    throw new Error();
                }
            }else{
                throw new Error();
            }
        }
      
    } catch (error) {
        res.status(400).json("Invalid login creadential.");
    }
   
});

router.post("/signup", async (req, res)=>{
    const {email, password} = req.body;
    try {
        const admin = new AdminModel({email, password});
        const dbResponse = await admin.save();
        res.status(201).json(dbResponse);
    } catch (error) {
        res.status(400).json("Admin registration failed, Error: "+error.message);
    } 
});


router.get("/hr-request/all", async (req, res)=>{
    try {
        const dbResponse = await AdminModel.findOne({});
        res.status(200).json(dbResponse.hrRequests);
    } catch (error) {
        res.status(404).json("Data not found");
    }
});

router.put("/hr-request/add/", async (req, res)=> {
    const hrId = req.body.hrid;
    try {
        const dbResponse = await AdminModel.updateOne({$push: {hrRequests: hrId}});
        res.status(200).json("Data save successfully.")
    } catch (error) {
        res.status(400).json("Data not saved. Error: "+error.message);
    }
});

router.delete("/hr-request/remove/:hrid", async (req, res)=>{
    const hrid = req.params.hrid;
    try {
        const dbResponse = await AdminModel.updateOne({$pull: {hrRequests: hrid}});
        console.log(dbResponse);
        if(dbResponse.modifiedCount>0){
            res.status(200).json("Data removed successfully.");
        }else{
            throw new Error();
        } 
    } catch (error) {
        console.log(error.message);
        res.status(400).json("Data not removed.");
    }
});


module.exports = router;