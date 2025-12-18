const { fileLoader } = require("ejs");
const Listing = require("../models/listing.js");

const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({accessToken : mapToken})


//Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/listindex.ejs", { allListings });
}
//New page
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

// Show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { // nested populate for to add review author name in listings
                path: "author"
            },
        }).populate("owner")
    console.log(listing)// populate means it prints the data of perticular objectId
    if (!listing) {
        req.flash("error", "the listing not exists")
        return res.redirect("/listings")
    }
    if (!listing.geometry || !Array.isArray(listing.geometry.coordinates)) {
    try {
      const geoRes = await geocodingClient.forwardGeocode({ query: listing.location, limit: 1 }).send();
      const feature = geoRes.body.features[0];
      if (feature && feature.geometry) {
        listing.geometry = feature.geometry;
        await listing.save();
        console.log('Backfilled geometry for listing', listing._id);
      } else {
        console.warn('No geocoding result for listing', listing._id);
      }
    } catch (err) {
      console.error('Geocoding error in showListing:', err.message);
    }
  }

    res.render("listings/listshow.ejs", { listing })
}

//Create listing
module.exports.createListing = async (req, res) => {

   let response = await  geocodingClient
   .forwardGeocode({
  query: req.body.listing.location,
  limit: 2
})
  .send()
 

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, " ", filename)

    // It is for handle hopscotch errors
    // if(!req.body || !req.body.listing){
    //     throw new ExpressError(404,"Enter valid format")
    // }
    // easy syntax we convert key value pair in new.ejs
    let listing = req.body.listing;
    // // we create instance 
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry;
    const savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("sucess", "New listing Created sucessfully")
    res.redirect("/listings");
}

//Edit route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "the listing not exists")
        return res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/e_blur:200,h_300,w_250") // to show blur image preview in edit form
    res.render("listings/edit.ejs", { listing, originalImageUrl })
}

//Update Route
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(404, "Enter valid format");
    }
    const { id } = req.params;
    // Update listing fields
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    // If a new image is uploaded, update the image
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }
    req.flash("sucess", "Listing updated successfully");
    res.redirect("/listings");
};

//Delete Route 
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("sucess", " listing Deleted sucessfully")
    res.redirect("/listings")
}