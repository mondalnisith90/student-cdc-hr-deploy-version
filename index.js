require('dotenv').config();
const express = require('express');
const mongoose = require('./database_con/databasecon');
const studentApi = require('./controllers/student_api');
const hrApi = require('./controllers/hr_api');
const adminApi = require('./controllers/admin_api');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());
app.use("/student",studentApi);
app.use("/hr", hrApi);
app.use("/admin", adminApi);

if(process.env.NODE_ENV=="production"){
    app.use(express.static("frontend/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}


// console.log(path.join(__dirname, "../frontend", "build", "index.html"))

app.listen(port, ()=>{
    console.log(`Server is running at port: ${port}`);
})