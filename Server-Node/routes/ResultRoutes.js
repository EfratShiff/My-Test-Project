const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/ResultController');

// נתיבים קיימים
router.post('/createResult', ResultController.createResult);
router.get('/getResult/:id', ResultController.getResult);
router.get('/getAllResult', ResultController.getAllResult);
router.get('/getResultByTestId/:testId', ResultController.getResultByTestId);
router.get('/getResultByStudentId/:studentId', ResultController.getResultByStudentId);

// נתיב חדש לבדיקה אם תלמיד כבר נבחן במבחן
router.get('/check-test/:testId', ResultController.checkTestTaken);

module.exports = router; 