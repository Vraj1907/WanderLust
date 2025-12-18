const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js")
const ExpressError = require("./utils/expressError.js")
// function isLoggedIn(req,res,next){

//     if(!req.isAuthenticated()){ // isAuthenticated() means the user information that is stored in session can only add listings
//         req.session.redirectUrl = req.originalUrl;
//         req.flash("error","You have to login first");
//         return res.redirect("/login")
//     }
//  next();
  
// }
// module.exports = isLoggedIn;


// module.exports.saveRedirectUrl =(req,res,next)=>{

//     if(req.session.redirectUrl){
//      res.locals.redirectUrl = req.session.redirectUrl;
   
//     }
//          next();
// }

// // for authorization
// module.exports.isOwner = async(req,res,next)=>{

//     let {id } = req.params;
//     let listing =await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.currUser._id)){
// req.flash("error","you have not permission to edit listing");
// return res.redirect(`/listings/${id}`);
//     }
// }

function isLoggedIn(req, res, next) {
     if(!req.isAuthenticated()){ // isAuthenticated() means the user information that is stored in session can only add listings
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You have to login first");
        return res.redirect("/login")
     }
    next();
}

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you have not permission to edit listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports = { isLoggedIn, saveRedirectUrl, isOwner };

module.exports.validateResult = (req,res,next) =>{
let {error}  = listingSchema.validate(req.body); // it is for joi request from hopschotch
   if(error){
    throw new ExpressError(400, error);
   }
   else{
    next();
   }
}

module.exports.validateReview = (req,res,next) =>{
let {error}  = reviewSchema.validate(req.body); // it is for joi request from hopschotch
   if(error){
    throw new ExpressError(400, error);
   }
   else{
    next();
   }
}

module.exports.isReviewAuthor =async (req,res,next)=>{
        let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!res.locals.currUser ||!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Author of the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}