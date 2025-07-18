const express = require("express");
const path = require('path')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const dbConfig = require('./config/dbConfig')
const rootDir = require('./utils/dirname')
require('dotenv').config();
dbConfig()
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use(cors({
    origin:true,
    credentials: true
}))

const {home, auth, swaps} = require('./routes/index')
app.use(home)
app.use("/api",auth)
app.use("/api",swaps)

module.exports =  app