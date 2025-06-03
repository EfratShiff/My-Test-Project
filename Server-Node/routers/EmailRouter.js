const express = require("express");
const router = express.Router();

const  { SendMark,forgotPassword,verifyTempPassword,changePassword}= require("../controllers/MailController");

router.post('/forgot-password', forgotPassword);
router.post('/verify-temp-password', verifyTempPassword);
router.post('/change-password', changePassword);
router.post("/SendMark", SendMark);
module.exports = router;

