const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
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
            .normalizeEmail(),

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
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

module.exports = validate