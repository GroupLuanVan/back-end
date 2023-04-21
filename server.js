//dotenv
require('dotenv').config();

//connect DB
const { connectDB } = require('./configs/db.js');
connectDB();

const express = require('express');
const cors = require('cors');

//Import Route
const authRoute = require('./routes/authRoute');
const jobpostRoute = require('./routes/jobpostRoute');
const userRoute = require('./routes/userRoute');
const jobcategoryRoute = require('./routes/jobcategoryRoute.js');
const positionRoute = require('./routes/positionRoute');
const addressRoute = require('./routes/addressRoute');
const companyRoute = require('./routes/companyRoute');
const contactRoute = require('./routes/contactRoute');
const candidateRoute = require('./routes/candidateRoute');
const resumeRoute = require('./routes/resumeRoute');

const { register } = require('./controllers/authController');

//chay cai server len
const app = express();

//khoi tao cors: cho pheps front-end ket noi voi back-end
app.use(cors());

//Body parser
app.use(express.json());

//Mount the Route (ket noi Route toi server)
app.use('/api/auth', authRoute);
app.use('/api/jobpost', jobpostRoute);
app.use('/api/user', userRoute);
app.use('/api/jobcategory', jobcategoryRoute);
app.use('/api/position', positionRoute);
app.use('/api/address', addressRoute);
app.use('/api/company', companyRoute);
app.use("/api/contact", contactRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/resume", resumeRoute);
//cong 5000
const port = process.env.APP_PORT;

//khi chay thanh cong thi thong bao
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
