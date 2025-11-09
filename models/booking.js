const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: String,
  hotel: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Listing"
},
  date: Date,
});
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
