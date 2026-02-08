// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to get login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to get register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to get the account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to build edit account view
router.get("/edit/:account_id", utilities.handleErrors(accountController.buildAccountEdit));

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Process the update account data
router.post(
    "/edit/",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

module.exports = router;
