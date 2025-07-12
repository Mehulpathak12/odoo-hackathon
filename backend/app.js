const express = require("express");
const path = require('path')
const cookieParser = require('cookie-parser');
const app = express();
const dbConfig = require('./config/dbConfig')
const rootDir = require('./utils/dirname')
require('dotenv').config();
dbConfig()
app.use(express.json());
const {home} = require('./routes/index')
app.use(home)

module.exports =  app