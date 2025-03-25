

require('dotenv').config();  // טוען את קובץ ה-.env

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs")

const UserRouter = require("./routers/UserRouter");
const TestRouter = require("./routers/TestRouter");

const bodyParser = require("body-parser")

const connectDb = process.env.DB_CONNECT;  // כאן אתה שולף את ה-URI מה-ENV
app.use(bodyParser.json());
mongoose.connect(connectDb).then(() => {
    console.log('connected');
}).catch(err => {
    console.log(err);
});
app.use("/User", UserRouter);
app.use("/Test", TestRouter);

app.listen(process.env.APP_PORT, () => {
    console.log("runnn");
});
