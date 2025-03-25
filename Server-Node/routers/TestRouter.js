const express = require("express")
const router = express.Router()



const {createTest,getTest}= require("../controllers/TestController")
console.log("router");

router.post("/createTest",createTest)
router.get('/getTest/:title', getTest);  // לוודא שהנתיב נכון



module.exports= router