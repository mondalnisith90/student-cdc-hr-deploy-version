const jwt = require('jsonwebtoken');
const StudentModel = require('../models/hr_model');

const userAuth = async (req, res, next)=>{
    try {
        const jwtToken = req.cookies.user_key;
        console.log("hrt jwt=", jwtToken)
        const userObj = await jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
        const userId = userObj.userId;
        const dbResponse = await StudentModel.findOne({_id: userId, jwtToken: jwtToken});
        if(dbResponse){
            req.userData = {
                _id: dbResponse._id,
                name: dbResponse.name,
                profile_pic: dbResponse.profile_pic,
                type: dbResponse.type,
                sortlistedProfiles: dbResponse.sortlistedProfiles
            }
            next();
        }else{
            throw new Error();
        }

    } catch (error) {
        res.status(401).json("unauthorized user. First Login or SignIn.");
    }
}

module.exports = userAuth;