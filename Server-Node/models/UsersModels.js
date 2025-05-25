const mongoose = require("mongoose")

const UserSchema=mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['teacher', 'student','manager'], required: true },
})
const User = mongoose.model("UserSchema", UserSchema)   
module.exports = User
