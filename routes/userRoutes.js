const express = require("express");
const userController = require("./../controllers/userController");
const authController = require('./../controllers/authController');
const { getUsers, getUser, updateUser, createUser, deleteUser, updateMe, deleteMe, getMe,uploadUserPhoto,resizeUserPhoto } = userController
const { signup, login, forgotPassword, resetPassword, protect, updatePassword, restrictTo } = authController;


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all this routes after middleware
router.use(protect)

router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', uploadUserPhoto,resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);
router.get('/me', getMe, getUser);


router.use(restrictTo('admin'));

router
    .route('/')
    .get(getUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = router