const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname", "Please provide a first name.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isLength({ min: 1 }),

        // lastname is required and must be string
        body("account_lastname", "Please provide a last name.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isLength({ min: 2 }),

        // valid email is required and cannot already exist in the DB
        body("account_email", "A valid email is required.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isEmail()
            .bail()
            .normalizeEmail()
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please log in or use different email.")
                }
            }),

        // password is required and must be strong password
        body("account_password", "Password does not meet requirements.")
            .trim()
            .notEmpty()
            .bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let accountLink = await utilities.getAccountLink(req, res)
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            accountLink,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
        // valid email is required and cannot already exist in the DB
        body("account_email", "A valid email is required.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isEmail()
            .bail()
            .normalizeEmail()
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists) {
                    throw new Error("Email does not exist. Please register or use different email")
                }
            }),

        // password is required and must be strong password
        body("account_password", "Password does not meet requirements.")
            .trim()
            .notEmpty()
            .bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
    ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let accountLink = await utilities.getAccountLink(req, res)
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            accountLink,
            account_email
        })
        return
    }
    next()
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.updateRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname", "Please provide a first name.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isLength({ min: 1 }),

        // lastname is required and must be string
        body("account_lastname", "Please provide a last name.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isLength({ min: 2 }),

        // valid email is required and must match format
        body("account_email", "A valid email is required.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .isEmail()
            .bail()
            .normalizeEmail()
    ]
}

/* ******************************
 * Check data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const account_id = parseInt(req.body.account_id)
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let accountLink = await utilities.getAccountLink(req, res)
        res.render("account/edit", {
            errors,
            title: "Edit Account",
            nav,
            accountLink,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
        return
    }
    next()
}

/*  **********************************
  *  Password Update Validation Rules
  * ********************************* */
validate.passwordUpdateRules = () => {
    return [     
        // password is required and must be strong password
        body("account_password", "Password does not meet requirements.")
            .trim()
            .notEmpty()
            .bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
    ]
}

/* ******************************
 * Check data and return errors or continue to password update
 * ***************************** */
validate.checkPasswordUpdateData = async (req, res, next) => {
    const account_id = parseInt(req.body.account_id)
    let data = await accountModel.getAccountById(account_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let accountLink = await utilities.getAccountLink(req, res)
        res.render("account/edit", {
            errors,
            title: "Edit Account",
            nav,
            accountLink,
            account_firstname: data.account_firstname,
            account_lastname: data.account_lastname,
            account_email: data.account_email,
            account_id
        })
        return
    }
    next()
}



module.exports = validate