const express = require('express')


const router = express.Router({mergeParams : true});
// when we have to use properties from parent route(index.js) to any callbacks we have to use merge params

const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing.js");
const Review = require('../models/review.js')

const {isLoggedIn,isReviewAuthor,validateReview}=require("../middleware.js")
const reviewController = require("../controllers/reviews.js")





//for review
//post route

router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.createReview)
)// It means the route is /listings/:id/reviews

// for review Delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewController.destroyReview)
    // it means the route is /listings/:id/reviews/:reviewId

module.exports = router; 