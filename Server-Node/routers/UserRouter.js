const express = require("express");
const router = express.Router();
const { createUser, deleteUser, getUser, getUserById, getAllUser, resetPassword, forgotPassword } = require("../controllers/UserController");
const { authenticateToken, checkRole } = require('../middleware/UserAuthentication');
const userController = require("../controllers/UserController");


router.get('/getAllUser', getAllUser);
router.post("/createUser", authenticateToken, checkRole(['manager']), createUser);
router.delete('/deleteUser/:name/:email', deleteUser);
router.post('/getUser', getUser);
router.post('/forgot-password', forgotPassword);



// הוספת ה-route ל-resetPassword
// router.post('/resetPassword', resetPassword);

router.get('/getUserById/:id', getUserById);

module.exports = router;
