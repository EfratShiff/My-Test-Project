const express = require("express")
const router = express.Router()
const {createUser,deleteUser,getUser}= require("../controllers/UserController")
const UserAuthentication = require('../middleware/UserAuthentication');


router.post("/createUser",/*UserAuthentication,*/createUser)
// router.delete('/deleteUser/:name/:passwordUser', deleteUser);
router.post('/getUser', getUser);

router.delete('/deleteUser', deleteUser);


module.exports= router



