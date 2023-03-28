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

//cong 5000
const port = process.env.APP_PORT;

//khi chay thanh cong thi thong bao
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
