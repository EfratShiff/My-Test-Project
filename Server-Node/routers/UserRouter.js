const express = require("express")
const router = express.Router()
const {createUser,deleteUser}= require("../controllers/UserController")
const UserAuthentication = require('../middleware/UserAuthentication');


router.post("/createUser",/*UserAuthentication,*/createUser)
// router.delete('/deleteUser/:name/:passwordUser', deleteUser);

router.delete('/deleteUser', deleteUser);


module.exports= router




// // routers/UserRouter.js
// const express = require("express");
// const router = express.Router();
// const { createUser, deleteUser } = require("../controllers/UserController");
// const UserAuthentication = require('../middleware/UserAuthentication');

// // ניתוב ליצירת משתמש חדש
// router.post("/createUser", UserAuthentication, createUser);

// // ניתוב למחיקת משתמש
// router.delete('/deleteUser', deleteUser);

// module.exports = router;
