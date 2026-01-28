// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const account = require("../controllers/accountController")

// Route to get login view
router.get("/login", utilities.handleErrors(account.buildLogin))

// Route to get register view
router.get("/register", utilities.handleErrors(account.buildRegister))

// Route to register a new account
router.post('/register', utilities.handleErrors(account.registerAccount))

module.exports = router;
