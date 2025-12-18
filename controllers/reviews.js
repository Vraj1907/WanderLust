const Listing = require("../models/listing.js");
const Review = require('../models/review.js')

module.exports.createReview = async(req,res)=>{

    let {id} = req.params;
    const listing =await Listing.findById(id);
    const newReview = new Review( 
        req.body.review);
newReview.author = req.user._id;
        listing.reviews.push(newReview);
        // here reviews means the schema that is defined in listing.js

        await newReview.save();
        await listing.save();
        console.log(newReview)
        console.log("review added succhessfully");
              req.flash("sucess"," Review added sucessfully")
        

         res.redirect(`/listings/${listing._id}`);
       
}

//Delete Route
module.exports.destroyReview = async(req,res)=>{

 let {id,reviewId}=req.params;
 await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}} ) 
// we have to delete reviews from listings too so that,

// $pull operator finds the element inside an array if matches condition it remvoes it from arrAY
// it means in reviews array if any particular reviews's Id matches with reviewId it pulls means removes 

 await Review.findByIdAndDelete(reviewId)
       req.flash("sucess"," Review Deleted sucessfully")
res.redirect(`/listings/${id}`)
}