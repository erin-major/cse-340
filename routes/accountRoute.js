// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const account = require("../controllers/accountController")

// Route to get login view
router.get("/login", utilities.handleErrors(account.buildLogin))
router.get("/register", utilities.handleErrors(account.buildRegister))

module.exports = router;
