const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    accountLink,
    grid,
    errors: null
  })
}

/* ***************************
 *  Build details by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getDetailsByInventoryId(inv_id)
  const grid = await utilities.buildDetailsGrid(data)
  const reviewData = await invModel.getReviewsByInventoryId(inv_id)
  const reviewGrid = await utilities.buildReviewGrid(reviewData)
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const vehicleName = data.inv_year + " " + data.inv_make + " " + data.inv_model
  res.render("./inventory/details", {
    title: vehicleName,
    nav,
    accountLink,
    grid,
    reviewGrid,
    errors: null
    // inv_id,
    // account_id: res.locals.accountData?.account_id
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management",
    nav,
    accountLink,
    classificationSelect,
    errors: null
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    accountLink,
    errors: null
  })
}

/* ****************************************
*  Process add classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const { classification_name } = req.body

  const classResult = await invModel.addClassification(
    classification_name
  )

  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added the ${classification_name} classification.`
    )
    let nav = await utilities.getNav()
    let accountLink = await utilities.getAccountLink(req, res)
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      accountLink,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      accountLink,
      classification_name
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    accountLink,
    classificationList,
    errors: null
  })
}

/* ****************************************
*  Process add inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

  const inventoryResult = await invModel.addInventory(
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
  )

  if (inventoryResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added the ${inv_make} ${inv_model} inventory item.`
    )
    let nav = await utilities.getNav()
    let accountLink = await utilities.getAccountLink(req, res)
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      accountLink,
      errors: null,
    })
  } else {
    let classificationList = await utilities.buildClassificationList()
    req.flash("notice", "Sorry, adding the inventory item failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      accountLink,
      errors: null,
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
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Return Edit Inventory View
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const inv_id = parseInt(req.params.inv_id)
  const inventoryData = await invModel.getDetailsByInventoryId(inv_id)
  const name = inventoryData.inv_make + " " + inventoryData.inv_model
  const classificationList = await utilities.buildClassificationList(inventoryData.classification_id)
  res.render("./inventory/edit-inventory", {
    title: "Edit Inventory - " + name,
    nav,
    accountLink,
    classificationList: classificationList,
    errors: null,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_description: inventoryData.inv_description,
    inv_image: inventoryData.inv_image,
    inv_thumbnail: inventoryData.inv_thumbnail,
    inv_price: inventoryData.inv_price,
    inv_miles: inventoryData.inv_miles,
    inv_color: inventoryData.inv_color,
    classification_id: inventoryData.classification_id
  })
}

/* ****************************************
*  Process update inventory
* *************************************** */
invCont.updateInventory = async function (req, res) {
  const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated the ${inv_make} ${inv_model} inventory item.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    let classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, updating the inventory item failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit Inventory - " + itemName,
      nav,
      accountLink,
      errors: null,
      classificationList: classificationList,
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
  }
}

/* ***************************
 *  Return Delete Inventory View
 * ************************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const inv_id = parseInt(req.params.inv_id)
  const inventoryData = await invModel.getDetailsByInventoryId(inv_id)
  const name = inventoryData.inv_make + " " + inventoryData.inv_model
  res.render("./inventory/delete-confirm", {
    title: "Delete Inventory - " + name,
    nav,
    accountLink,
    errors: null,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_price: inventoryData.inv_price,
  })
}

/* ****************************************
*  Process delete inventory
* *************************************** */
invCont.deleteInventory = async function (req, res) {
  const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve deleted the inventory item.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, deleting the inventory item failed.")
    res.status(501).render("inventory/delete-confirm", {
      title: "Delete Inventory - " + itemName,
      nav,
      accountLink,
      errors: null,
      inv_id: inventoryData.inv_id,
      inv_make: inventoryData.inv_make,
      inv_model: inventoryData.inv_model,
      inv_year: inventoryData.inv_year,
      inv_price: inventoryData.inv_price,
    })
  }
}

/* ****************************************
*  Process add review
* *************************************** */
invCont.addReview = async function (req, res) { 
  const { review_text, inv_id, account_id } = req.body
  const addReviewResult = await invModel.addReview(
    review_text,
    inv_id,
    account_id
  )

  if (addReviewResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added a review.`)
    res.redirect("/inv/detail/" + inv_id)
  } else {
    req.flash("notice", "Sorry, adding the review failed.")
    const data = await invModel.getDetailsByInventoryId(inv_id)
    const grid = await utilities.buildDetailsGrid(data)
    const reviewData = await invModel.getReviewsByInventoryId(inv_id)
    const reviewGrid = await utilities.buildReviewGrid(reviewData)
    let nav = await utilities.getNav()
    let accountLink = await utilities.getAccountLink(req, res)
    const vehicleName = data.inv_year + " " + data.inv_make + " " + data.inv_model
    res.status(501).render("./inventory/details", {
        title: vehicleName,
        nav,
        accountLink,
        grid,
        reviewGrid,
        account_id,
        inv_id,
        review_text,
        errors: null
    })
  }
}


module.exports = invCont