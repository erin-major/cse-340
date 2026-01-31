const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        // classification_name is required, must be a string, and cannot already exist in the DB
        body("classification_name", "Please provide a valid classification name.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .matches(/^[A-Za-z ]+$/)
            .bail()
            .isLength({ min: 1 })
            .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClassification(classification_name)
            if (classExists) {
                throw new Error("Classification exists. Please use different classification name.")
            }
        })     
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassification = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name            
        })
        return
    }
    next()
}

module.exports = validate