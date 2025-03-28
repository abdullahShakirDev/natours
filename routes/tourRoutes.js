const express = require("express");
const tourController = require("./../controllers/tourController");
const { getTours, aliasTopTours, getTourStats, getMonthlyPlan, getTour, updateTour, createTour, deleteTour, getToursWithin, getDistances,uploadTourImages,resizsTourImages } = tourController
const authController = require('./../controllers/authController');
const { protect, restrictTo } = authController;
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router();

// router.param('id', checkId)

// POST /tour/232afs33/reviews
// GET /tour/231afd66/reviews

router.use('/:tourId/reviews', reviewRouter)

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getTours);

router
    .route('/tour-stats')
    .get(getTourStats);

router
    .route('/monthly-plan/:year')
    .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);


router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(getToursWithin)

router
    .route('/distances/:latlng/unit/:unit')
    .get(getDistances)

router
    .route('/')
    .get(getTours)
    .post(protect, restrictTo('admin', 'lead-guide'), createTour)

router
    .route('/:id')
    .get(getTour)
    .patch(protect, restrictTo('admin', 'lead-guide'), uploadTourImages, resizsTourImages, updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour)


module.exports = router

