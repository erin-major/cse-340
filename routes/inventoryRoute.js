// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Process the add classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassification,
    utilities.handleErrors(invController.addClassification)
)

router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventory,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;