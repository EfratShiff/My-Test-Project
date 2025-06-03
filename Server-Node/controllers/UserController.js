const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { send } = require('process');
const Result = require("../models/ResultTestsModels");
const Test = require("../models/TestModels");
const User = require("../models/UsersModels");

async function createUser(req, res) {  
    try {
        const { name, email, password, role } = req.body;
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            name,
            email,
            password: hashedPassword, 
            role
        });
        await newUser.save();
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET,
             { expiresIn: '1h' }
        );

        res.status(201).json({
            user: newUser,
            token: token
        });

    } catch (error) {
        res.status(500).send('Error creating user');
    }
}


async function deleteUser(req, res) {
    const { email, password } = req.body; 

    try {
        const user = await User.findOne({ email });
        console.log("user"+user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("isMatch"+isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        await User.deleteOne({ email });
        return res.status(200).json({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

async function getUserById(req, res) {
    const userId = req.params.id; 
    try {
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

async function getAllUser(req, res) {
    try {
        let users = await User.find();
        console.log("Users: ", users);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getUser(req, res) {
    const { email, password, roleToCheck } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });   

        if (roleToCheck && user.role !== roleToCheck) {
            return res.status(403).json({ error: 'User is not a ' + roleToCheck });
        }
        
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log(user.name);
        res.status(200).json({ token, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}



module.exports = { 
    createUser, 
    deleteUser, 
    getUser, 
    getUserById, 
    getAllUser,  
};