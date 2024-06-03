const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors({origin: 'http://localhost:3001',credentials: true })); 
require('dotenv').config();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const PORT = process.env.PORT || 4000; 

const dbConnect = require('./config/database');
dbConnect();

const user = require('./routes/user');
app.use('/todo/v1/user',user)

app.listen(PORT,()=>{
    console.log(`App is running on ${PORT}`);
}) 