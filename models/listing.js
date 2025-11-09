const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        filename: { type: String },
        url: {
            type: String,
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews :[{

        type : Schema.Types.ObjectId,
        ref : "Review" // model
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry :{
        type:{
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    }
        
    
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


// It is post middleWare where it is used for to delete reviews in database if corresponding listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{

    if(listing){
    await Review.deleteMany( _id, {$in : listing.reviews})
    }



})