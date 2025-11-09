const Booking = require('../models/booking');
const Listing = require('../models/listing');

exports.getBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const bookings = await Booking.find({hotel: id});
    res.render('listings/booking.ejs', { bookings, listing });
    
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;
  const user = req.user ? req.user.username : req.body.user; // fallback for manual entry
  const booking = new Booking({ user, hotel: id, date }); // price removed
  try {
    await booking.save();
    res.redirect(`/listings/${id}/booking`);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.myBookings = async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to view your bookings.");
    return res.redirect("/login");
  }
  // Find bookings where user matches current user's username or _id
  const bookings = await Booking.find({ user: req.user.username }).populate('hotel');
  res.render('listings/myBookings.ejs', { bookings });
};
