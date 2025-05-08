// const express = require("express")
// const router = express.Router()
// const {createUser,deleteUser,getUser}= require("../controllers/UserController")
// const UserAuthentication = require('../middleware/UserAuthentication');


// router.post("/createUser",/*UserAuthentication,*/createUser)
// // router.delete('/deleteUser/:name/:passwordUser', deleteUser);
// router.post('/getUser', getUser);

// router.delete('/deleteUser', deleteUser);


// module.exports= router




const express = require("express")
const router = express.Router()
const {createUser,deleteUser,getUser,getUserById,getAllUser}= require("../controllers/UserController")
const { authenticateToken, checkRole } = require('../middleware/UserAuthentication');
const checkManagerRole = require('../middleware/checkManagerRole');

router.get('/getAllUser',  getAllUser); 
router.post("/createUser", authenticateToken, checkRole(['manager']) , createUser);
router.delete('/deleteUser/:name/:password', deleteUser);
router.post('/getUser', getUser);

router.delete('/deleteUser', deleteUser);
router.get('/getUserById/:id', getUserById);
module.exports= router

