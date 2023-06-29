var express = require("express");
const { homePage } = require("../controllers/homeController.js");
var router = express.Router();
const { authenticateToken } = require("../middleware/verifyToken");

/* GET home page. */
router.get("/", authenticateToken, homePage);

module.exports = router;
