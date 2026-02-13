const invModel = require("../models/inventory-model")
const acctModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data.rows)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' Details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailsGrid = async function (data) {
  let grid
  if (data) {
    grid = '<div id="inv-detail-display">'
    grid += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + '">'
    grid += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>'
    grid += '<p><b>Price:</b> ' + new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(data.inv_price) + '</p>'
    grid += '<p><b>Description:</b> ' + data.inv_description + '</p>'
    grid += '<p><b>Color:</b> ' + data.inv_color + '</p>'
    grid += '<p><b>Miles:</b> ' + data.inv_miles.toLocaleString('en-US') + '</p>'
    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the review view HTML
* ************************************ */
Util.buildReviewGrid = async function (data) {
  let reviewGrid
  reviewGrid = '<div id="inv-review-display">'
  reviewGrid += '<h3>Customer Reviews</h3>'
  if (data.length > 0) {
    reviewGrid += '<ul>'
    data.forEach((review) => {
      let date = review.review_date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
      reviewGrid += '<li>'
      reviewGrid += `<p><b>${review.account_firstname[0]}${review.account_lastname}</b> wrote on ${date}</p> <hr>`
      reviewGrid += `<p>${review.review_text}</p> </li>`
    })
    reviewGrid += '</ul>'

  } else {
    reviewGrid += '<p id="noReview">Be the first to write a review.</p>'
  }
  reviewGrid += '</div>'
  return reviewGrid
}

/* **************************************
* Build the classification list in inventory form
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()

  let classificationList =
    '<select name="classification_id" id="classificationList" required autofocus>'

  classificationList += `<option value="" disabled ${classification_id == null ? "selected" : ""
    }>Choose a Classification</option>`

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`

    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }

    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"

  return classificationList
}

/* ************************
 * Constructs the account link in header
 ************************** */
Util.getAccountLink = async function (req, res, next) {
  let accountLink = ""
  if (res.locals.loggedin) {
    accountLink = `<a href=/account title="Click to manage your account">Welcome ${res.locals.accountData.account_firstname} |</a> <a href="/account/logout" title="Click to log out">Logout</a>`
  } else {
    accountLink = '<a href="/account/login" title="Click to log in">My Account</a>'
  }
  return accountLink
}

/* ************************
 * Build Account Management View
 ************************** */
Util.buildAccountManagement = async function (req, res, next) {
  let grid = ""
  let allowedTypes = ['Admin', 'Employee']
  let accountType = res.locals.accountData.account_type
  grid += `<h2>Welcome ${res.locals.accountData.account_firstname}!</h2>`
  grid += `<p id='loggedInMessage'>You're logged in.</p>`
  grid += `<a href=/account/edit/${res.locals.accountData.account_id} id='editAccount' title='Click to edit account information'>Edit Account Information</a>`
  if (allowedTypes.includes(accountType)) {
    grid += '<h3>Inventory Management</h3>'
    grid += `<a href=/inv title='Click to manage inventory' id='manageInv'>Manage Inventory</a>`
  }
  return grid
}

/* ************************
 * Build User Reviews
 ************************** */
Util.buildUserReviews = async function (data) {
  let reviews
  if (data.length > 0) {
    reviews = '<ol class="reviews-list">'
    data.forEach((row) => { 
      let date = row.review_date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
      reviews += `<li> Reviewed the ${row.inv_year} ${row.inv_make} ${row.inv_model} on ${date} | <a href="/inv/review/edit/${row.review_id}" title="Click to update">Edit</a> | <a href="/inv/review/delete/${row.review_id}" title="Click to delete">Delete</a></li>`
    })
    reviews += '</ol>'
  } 
  return reviews
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
* Refresh JWT token after account update
**************************************** */
Util.refreshJWTToken = async function (req, res, next) {
  let account_id = parseInt(req.body.account_id)
  let data = await acctModel.getAccountById(account_id)
  res.clearCookie('jwt');
  try {
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    next()
  } catch (error) {
    next(new Error('Access Forbidden'))
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Edit Account Match
 * ************************************ */
Util.checkAccountMatch = (req, res, next) => {
  let req_account_id = parseInt(req.params.account_id)
  if (res.locals.loggedin) {
    if (res.locals.accountData.account_id === req_account_id) {
      next()
    } else {
      req.flash("notice", "Insufficient permissions.")
      return res.redirect("/account/")
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check account type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  const allowedTypes = ['Admin', 'Employee']
  const accountType = res.locals.accountData?.account_type
  if (allowedTypes.includes(accountType)) {
    next()
  } else {
    req.flash("notice", "Insufficient permissions.")
    return res.redirect("/account/login")
  }
}

module.exports = Util