const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// נתיבים
router.post('/createUser', UserController.createUser);
router.delete('/deleteUser/:email', UserController.deleteUser);
router.post('/getUser', UserController.getUser);
router.get('/getUserById/:id', UserController.getUserById);
router.get('/getAllUser', UserController.getAllUser);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/verify-temp-password', UserController.verifyTempPassword);
router.post('/change-password', UserController.changePassword);
router.post('/send-mark', UserController.SendMark);

module.exports = router; 