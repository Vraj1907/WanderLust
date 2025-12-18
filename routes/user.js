const express = require('express')
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require("../controllers/users.js")

//For signup
router
.route("/signUp")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signUp)
);

// for login
router
.route("/login")
.get(userController.renderLoginForm)
.post(
     saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect : "/login",
    failureFlash : true
}),userController.login)


// for logout
router.get("/logout",userController.logout)
module.exports = router;