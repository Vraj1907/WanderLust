const express = require('express');
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const bookingController = require('../controllers/booking.js');

router.get('/listings/:id/booking', wrapAsync(bookingController.getBookings));
router.post('/listings/:id/booking',  wrapAsync(bookingController.createBooking));

router.get('/my-bookings', wrapAsync(bookingController.myBookings));
module.exports = router;
