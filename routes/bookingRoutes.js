const express = require('express');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');
const { getCheckoutSession,getBooking,getBookings,deleteBooking,updateBooking,createBooking } = bookingController;
const { protect , restrictTo} = authController;

const router = express.Router();

router.use(protect)

router.get('/checkout-session/:tourId', getCheckoutSession);


router.use(restrictTo('admin','lead-guide'));

router.route('/').get(getBookings).post(createBooking);
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;


