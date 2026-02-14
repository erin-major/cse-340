const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}
const validator = require("validator")

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
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassification = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let accountLink = await utilities.getAccountLink(req, res)
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            accountLink,
            classification_name
        })
        return
    }
    next()
}

/*  **********************************
  *  Add Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        // classification_id is required
        body("classification_id", "Please select a classification.")
            .notEmpty(),

        // inv_make is required and must be a string
        body("inv_make", "Please provide a valid vehicle make.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .matches(/^[A-Za-z ]+$/)
            .bail()
            .isLength({ min: 1 }),

        //inv_model is required and must be a string
        body("inv_model", "Please provide a valid vehicle model.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .matches(/^[A-Za-z ]+$/)
            .bail()
            .isLength({ min: 1 }),

        // inv_year is required and must be a valid year
        body("inv_year", "Please provide a valid vehicle year between 1886 and 2025")
            .trim()
            .notEmpty()
            .bail()
            .isInt({ min: 1886, max: 2050 }),

        //inv_description is required
        body("inv_description", "Please provide a valid vehicle description.")
            .trim()
            .notEmpty()
            .bail()
            .matches(/^[A-Za-z0-9\s.,!?'_\-:;+$]+$/)
            .bail()
            .isLength({ min: 5 }),

        // inv_image is required and must be a valid URL
        body("inv_image", "Please provide a valid vehicle image URL.")
            .trim()
            .notEmpty()
            .bail()
            // AI helped me with this custom validator
            .custom((value) => {
                const isUrl = validator.isURL(value);
                const isLocalPath = /^\/images\/[A-Za-z0-9/_\-]+\.(png|jpg|jpeg|webp|gif)$/i.test(value);

                if (!isUrl && !isLocalPath) {
                    throw new Error("Image must be a valid URL or image path.");
                }

                return true;
            }),

        // inv_thumbnail is required and must be a valid URL
        body("inv_thumbnail", "Please provide a valid vehicle thumbnail URL.")
            .trim()
            .notEmpty()
            .bail()
            // AI helped me with this custom validator
            .custom((value) => {
                const isUrl = validator.isURL(value);
                const isLocalPath = /^\/images\/[A-Za-z0-9/_\-]+\.(png|jpg|jpeg|webp|gif)$/i.test(value);

                if (!isUrl && !isLocalPath) {
                    throw new Error("Thumbnail must be a valid URL or image path.");
                }

                return true;
            }),

        // inv_price is required and must be a valid price
        body("inv_price", "Please provide a valid vehicle price.")
            .trim()
            .notEmpty()
            .bail()
            .isFloat({ min: 0 }),

        // inv_miles is required and must be a valid number
        body("inv_miles", "Please provide a valid vehicle mileage.")
            .trim()
            .notEmpty()
            .bail()
            .isInt({ min: 0 }),

        body("inv_color", "Please provide a valid vehicle color.")
            .trim()
            .escape()
            .notEmpty()
            .bail()
            .matches(/^[A-Za-z ]+$/)
            .bail()
            .isLength({ min: 1 }),
    ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventory = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let accountLink = await utilities.getAccountLink(req, res)
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            accountLink,
            classificationList,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to update inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const inv_id = parseInt(req.body.inv_id)
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let accountLink = await utilities.getAccountLink(req, res)
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit Inventory - " + inv_make + " " + inv_model,
            nav,
            accountLink,
            classificationList,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            inv_id
        })
        return
    }
    next()
}

/*  **********************************
  *  Add Review Data Validation Rules
  * ********************************* */
validate.reviewRules = () => {
    return [
        // review_text is required and must be a string
        body("review_text", "Please provide valid review text.")
            .trim()
            .notEmpty()
            .bail()
            .matches(/^[A-Za-z0-9\s.,!?'_\-:;+$]+$/)
            .bail()
            .isLength({ min: 5 })        
    ]
}

/* ******************************
 * Check data and return errors or continue to update inventory
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
    const { review_text, inv_id, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const data = await invModel.getDetailsByInventoryId(inv_id)
        const grid = await utilities.buildDetailsGrid(data)
        const reviewData = await invModel.getReviewsByInventoryId(inv_id)
        const reviewGrid = await utilities.buildReviewGrid(reviewData)
        let nav = await utilities.getNav()
        let accountLink = await utilities.getAccountLink(req, res)
        const vehicleName = data.inv_year + " " + data.inv_make + " " + data.inv_model
        res.render("inventory/details", {
            title: vehicleName,
            nav,
            accountLink,
            grid,
            reviewGrid,
            errors,            
            review_text,
            inv_id,
            account_id
        })
        return
    }
    next()
}

module.exports = validate