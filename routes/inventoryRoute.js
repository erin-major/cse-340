// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build details by inventory view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to get inventory JSON object
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to build edit inventory view
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventoryView));

// Route to build delete inventory view
router.get("/delete/:inventoryId", utilities.handleErrors(invController.buildDeleteInventoryView));

// Process the add classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassification,
    utilities.handleErrors(invController.addClassification)
)

// Process the add inventory data
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventory,
    utilities.handleErrors(invController.addInventory)
)

// Process the update inventory data
router.post("/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Process the delete inventory data
router.post("/delete/",
    utilities.handleErrors(invController.deleteInventory))

module.exports = router;