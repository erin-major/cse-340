const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async (req, res) => {
    const nav = await utilities.getNav()
    let accountLink = await utilities.getAccountLink(req, res)
    res.render("index", { title: "Home", nav, accountLink, errors: null})
}

baseController.errorTest = async (req, res) => {
    const err = new Error('Test 500')
    err.status = 500
    throw err
}

module.exports = baseController