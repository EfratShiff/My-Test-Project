
const jwt = require('jsonwebtoken');
const User = require("../models/UsersModels");
const bcrypt = require("bcrypt");
async function createUser(req, res) {  
    try {
        const { name, email, password, role } = req.body;
        // הצפנת הסיסמה
        const saltRounds = 10;  // מספר סיבובי ההצפנה
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // יצירת משתמש עם סיסמה מוצפנת
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // משתמשים בסיסמה המוצפנת
            role
        });
        // שמירת המשתמש במסד נתונים
        await newUser.save();
        // יצירת טוקן
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role }, // כולל role
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        // החזרת הנתונים עם הטוקן
        res.status(201).json({
            user: newUser,
            token: token
        });

    } catch (error) {
        res.status(500).send('Error creating user');
    }
}

async function deleteUser(req, res) {
    const { name, passwordUser } = req.params;

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // השוואת הסיסמה
        if (passwordUser !== user.password) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // מחיקת המשתמש אם הסיסמה תואמת
        await User.deleteOne({ name });
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
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



module.exports = { createUser, deleteUser,getUser };
