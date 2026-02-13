// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details by inventory view
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassificationView));

// Route to build add inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventoryView));

// Route to get inventory JSON object
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON));

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventoryView));

// Route to build delete inventory view
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteInventoryView));

// Route to build edit review view
router.get("/review/edit/:review_id", utilities.checkLogin, utilities.handleErrors(invController.buildEditReviewView));

// Route to build delete review view
router.get("/review/delete/:review_id", utilities.checkLogin, utilities.handleErrors(invController.buildDeleteReviewView));

// Process the add classification data
router.post(
    "/add-classification",
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassification,
    utilities.handleErrors(invController.addClassification)
)

// Process the add inventory data
router.post(
    "/add-inventory",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInventory,
    utilities.handleErrors(invController.addInventory)
)

// Process the update inventory data
router.post("/update/",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Process the delete inventory data
router.post("/delete/",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory))

// Process the add review data
router.post("/review/add",
    utilities.checkLogin,
    invValidate.reviewRules(),
    invValidate.checkReviewData,
    utilities.handleErrors(invController.addReview))

module.exports = router;