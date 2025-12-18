const express = require('express')
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing.js");
const listingcontroller = require("../controllers/listings.js")
const multer = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage }) //multer upload the file in cloudary storage
const { isLoggedIn, isOwner, validateResult } = require('../middleware.js');

router.route("/")
    .get(wrapAsync(listingcontroller.index)) //Index Route 
    .post(validateResult, upload.single('listing[image][url]'), wrapAsync(listingcontroller.createListing)// add route
    );

//New route
router.get("/new", isLoggedIn, listingcontroller.renderNewForm)

router
    .route("/:id")
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[image][url]'),
        wrapAsync(listingcontroller.updateListing))// add route
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingcontroller.destroyListing)) //Delete route
    .get(wrapAsync(listingcontroller.showListing) // SHow route
    );

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingcontroller.renderEditForm)
);
module.exports = router;