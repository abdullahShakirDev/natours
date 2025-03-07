const express = require('express');
const authController = require('./../controllers/authController')
const reviewController = require('./../controllers/reviewController');
const { setTourUserIds, createReview, getReviews, deleteReview, updateReview, getReview } = reviewController;
const { protect, restrictTo } = authController

const router = express.Router({ mergeParams: true });

router.use(protect)

router
    .route('/')
    .get(getReviews)
    .post(restrictTo('user'), setTourUserIds, createReview)

router
    .route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(restrictTo('user', 'admin'), deleteReview)
module.exports = router