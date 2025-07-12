const express = require("express");
const router = express.Router();

router.route("/").get(require('../../controllers/home/homeController'))

module.exports = router