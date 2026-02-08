const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  res.render("account/login", {
    title: "Login",
    nav,
    accountLink,
    errors: null
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  res.render("account/register", {
    title: "Register",
    nav,
    accountLink,
    errors: null
  })
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  let grid = await utilities.buildAccountManagement(req, res)
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountLink,
    grid,
    errors: null
  })
}

/* ****************************************
*  Deliver account edit view
* *************************************** */
async function buildAccountEdit(req, res, next) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  let account_id = parseInt(req.params.account_id)
  let accountData = await accountModel.getAccountById(account_id)
  res.render("account/edit", {
    title: "Edit Account",
    nav,
    accountLink,
    errors: null,
    account_id: account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      accountLink,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      accountLink,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      accountLink,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res);
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      accountLink,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        accountLink,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let account_id = parseInt(req.body.account_id)
  let nav = await utilities.getNav()
  let accountLink = await utilities.getAccountLink(req, res)
  const { account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email    
  )

  if (updateResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated your account.`
    )
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, updating your account failed.")
    res.status(501).render("account/edit", {
      title: "Edit Account",
      nav,
      errors: null,
      accountLink,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, buildAccountManagement, buildAccountEdit, accountLogin, updateAccount }