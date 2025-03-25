const express = require("express")
const router = express.Router()

const {createUser,deleteUser}= require("../controllers/UserController")

router.post("/createUser",createUser)
router.delete('/deleteUser/:name/:passwordUser', deleteUser);


module.exports= router