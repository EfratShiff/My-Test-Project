
const jwt = require('jsonwebtoken');
const User = require("../models/UsersModels");
const bcrypt = require("bcrypt");
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
            { expiresIn: '10h' }
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
    const { name, password } = req.params;

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        await User.deleteOne({ name });
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

async function getUserById  (req, res) {
const userId = req.params.id; 
    try {
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user); 
}
    
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Server error' });
        }
}










async function getAllUser(req, res) {
    try {
        // חפש את כל המשתמשים במסד הנתונים
        let users = await User.find(); // כאן צריך לשמור את התוצאה במשתנה users
        console.log("Users: ", users); // הדפס את המשתמשים

        // אם לא נמצאו משתמשים, החזר שגיאה 404
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // החזר את המשתמשים כתגובה עם סטטוס 200
        res.status(200).json(users); // תשלח את המידע על המשתמשים
    } catch (error) {
        console.log('Error:', error);
        // החזר שגיאה 500 אם קרתה תקלה
        res.status(500).json({ message: 'Server error' });
    }
}




async function getUser(req, res) {
    const { email, password, roleToCheck } = req.body; // נוסיף את roleToCheck מהלקוח

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        // אם רוצים לבדוק שהוא מנהל – נוודא שה־role תואם
        if (roleToCheck && user.role !== roleToCheck) {
            return res.status(403).json({ error: 'User is not a ' + roleToCheck });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}



module.exports = { createUser, deleteUser,getUser,getUserById,getAllUser };
