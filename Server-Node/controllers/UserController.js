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

const SendMark = async (req, res) => {
    const { email, testId } = req.body;
  
    try {
      console.log(" התחלת שליחת ציון למייל...");
      console.log(" אימייל שהתקבל:", email);
      console.log(" מזהה מבחן שהתקבל:", testId);
  
      const student = await User.findOne({ email });
      if (!student) {
        console.log(" משתמש לא נמצא");
        return res.status(404).json({ error: "משתמש לא נמצא" });
      }
  
      console.log(" נמצא משתמש:", student);
  
      const result = await Result.findOne({
        TestId: testId,
        studentId: student._id
      });
  
      if (!result) {
        console.log(" לא נמצאה תוצאה במאגר עבור מבחן זה וסטודנט זה");
        return res.status(404).json({ error: "לא נמצאה תוצאה עבור המבחן" });
      }
  
      console.log(" נמצא תוצאה:", result);
  
      const test = await Test.findById(testId).populate("teacherId");
      if (!test) {
        console.log(" מבחן לא נמצא");
        return res.status(404).json({ error: "מבחן לא נמצא" });
      }
  
      console.log(" מבחן נמצא:", test);
  
      const teacher = test.teacherId;
      if (!teacher) {
        console.log(" מורה לא נמצא");
        return res.status(404).json({ error: "מורה לא נמצא" });
      }
  
      console.log(" מורה שמצורף למבחן:", teacher);
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: `הציון שלך במבחן "${test.title}"`,
        text: `
  שלום ${student.name},
  
  המבחן "${test.title}" נבדק.
  
  שם המורה: ${teacher.name}
  הציון שלך: ${result.Mark}/100
  
  בהצלחה! 
        `
      };
  
      console.log(" שליחת המייל מתבצעת כעת...");
      await transporter.sendMail(mailOptions);
      console.log(" מייל נשלח בהצלחה");
  
      res.status(200).json({ message: "המייל נשלח בהצלחה " });
  
    } catch (error) {
      console.error(" שגיאה בשליחת מייל:", error);
      res.status(500).json({ error: "שגיאת שרת בעת שליחת המייל: " + error.message });
    }
  };
  

const forgotPassword = async (req, res) => {
const { email } = req.body;
try {
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ error: "משתמש לא נמצא" });
    }

    const tempPassword = crypto.randomBytes(4).toString("hex");
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    user.password = hashedTempPassword;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "איפוס סיסמה",
        text: `הסיסמה הזמנית שלך היא: ${tempPassword}`, 
    });
    

    res.json({ message: "סיסמה זמנית נשלחה למייל" });
} catch (err) {
    console.error("שגיאה באיפוס סיסמה:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
}
};

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

        res.status(200).json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports = { createUser, deleteUser, getUser, getUserById, getAllUser,forgotPassword,SendMark };