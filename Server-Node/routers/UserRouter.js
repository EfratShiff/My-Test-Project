const express = require("express");
const router = express.Router();
const { createUser, deleteUser, getUser, getUserById, getAllUser, forgotPassword,SendMark } = require("../controllers/UserController");
const { authenticateToken, checkRole } = require('../middleware/UserAuthentication');
const userController = require("../controllers/UserController");


router.get('/getAllUser', getAllUser);
router.post("/createUser", authenticateToken, checkRole(['manager']), createUser);
router.delete('/deleteUser/', deleteUser);
router.post('/getUser', getUser);
router.post('/forgot-password', forgotPassword);
router.post("/SendMark", SendMark);
router.get('/getUserById/:id', getUserById);

module.exports = router;
