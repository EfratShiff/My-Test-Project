const express = require("express")
const router = express.Router()



const {createTest,getTest,getAllTest,deleteTest,updateTest}= require("../controllers/TestController")
console.log("router");

router.post("/createTest",createTest);
router.get("/getTest/:title", getTest); 
router.get("/getAllTest/", getAllTest);  
router.delete("/deleteTest/:title",deleteTest);
router.put("/updateTest/:title",updateTest);



module.exports= router