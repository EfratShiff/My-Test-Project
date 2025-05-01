// const User=require("../models/UsersModels")
// const bcrypt = require("bcrypt");



// async function createUser(req,res){//post- הוספת נתונים חדשים
//     let newUser = await new User(req.body)
//         await newUser.save()//שומר אותו ב DATA BASE
//         res.send(newUser)
// }


// async function deleteUser(req, res) {
//     const { name, passwordUser } = req.params; // מקבלים את שם המשתמש והסיסמה מה-URL

//     try {
//         const user = await User.findOne({ name });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
// console.log("passwordUser"+passwordUser);
// console.log("user.password"+user.password);

//         // // השוואת הסיסמה
//         if (passwordUser !== user.password) {
//             return res.status(400).json({ message: 'Incorrect password' });
//         }

//         // מחיקת המשתמש אם הסיסמה תואמת
//         await User.deleteOne({ name });
//         return res.status(200).json({ message: 'User deleted successfully' });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Server error' });
//     }
// }



// module.exports={createUser,deleteUser}

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
    const { email, password } = req.body;
  
    try {
      // מחפש את המשתמש לפי אימייל
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'User not found' });
  console.log(user.email);
  console.log(user.password);
  
      // משווה סיסמה
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid password' });
  
      // יוצר טוקן כולל role ו־_id
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ token });
  
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
// async function deleteUser(req, res) {
//     const { name, passwordUser } = req.body; // מקבלים את שם המשתמש והסיסמה ב-body
//     const token = req.header('Authorization')?.replace('Bearer ', ''); // שולף את הטוקן מתוך header

//     try {
//         // 1. חיפוש המשתמש ב-DB
//         const user = await User.findOne({ name });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // 2. השוואת הסיסמה המוצפנת עם bcrypt
//         const isMatch = await bcrypt.compare(passwordUser, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Incorrect password' });
//         }

//         // 3. אימות הטוקן
//         if (!token) {
//             return res.status(403).json({ message: 'Access denied, no token provided' });
//         }

//         // 4. אימות הטוקן
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // מאמת את הטוקן
//         if (decoded.id !== user._id.toString()) {
//             return res.status(403).json({ message: 'Invalid token, access denied' });
//         }

//         // 5. מחיקת המשתמש
//         await User.deleteOne({ _id: user._id });
//         return res.status(200).json({ message: 'User deleted successfully' });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Server error' });
//     }
// }

module.exports = { createUser, deleteUser,getUser };
