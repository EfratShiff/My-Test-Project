const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { send } = require('process');
const Result = require("../models/ResultTestsModels");
const Test = require("../models/TestModels");
const User = require("../models/UsersModels");

const SendMark = async (req, res) => {
    const { email, testId } = req.body;
  
    try {
      console.log("=== התחלת שליחת ציון למייל ===");
      console.log("אימייל שהתקבל:", email);
      console.log("מזהה מבחן שהתקבל:", testId);
  
      const student = await User.findOne({ email });
      if (!student) {
        console.log("משתמש לא נמצא במאגר");
        return res.status(404).json({ error: "משתמש לא נמצא" });
      }
  
      console.log("נמצא משתמש:", student.name);
  
      const result = await Result.findOne({
        TestId: testId,
        studentId: student._id
      });
  
      if (!result) {
        console.log("לא נמצאה תוצאה במאגר עבור מבחן זה וסטודנט זה");
        return res.status(404).json({ error: "לא נמצאה תוצאה עבור המבחן" });
      }
  
      console.log("נמצא תוצאה:", result);
  
      const test = await Test.findById(testId).populate("teacherId");
      if (!test) {
        console.log("מבחן לא נמצא במאגר");
        return res.status(404).json({ error: "מבחן לא נמצא" });
      }
  
      console.log("מבחן נמצא:", test.title);
  
      const teacher = test.teacherId;
      if (!teacher) {
        console.log("מורה לא נמצא במאגר");
        return res.status(404).json({ error: "מורה לא נמצא" });
      }
  
      console.log("מורה שמצורף למבחן:", teacher.name);
  
      console.log("מכין את תצורת המייל...");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: `הציון שלך במבחן "${test.title}"`,
        html: `
        <div style="direction: rtl; font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
          <h2 style="color: #2c3e50;">שלום ${student.name},</h2>
          <p>המבחן <strong>"${test.title}"</strong> נבדק בהצלחה.</p>
          
          <table style="margin-top: 15px; border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>שם המורה:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;">${teacher.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong>הציון שלך:</strong></td>
              <td style="padding: 8px; border: 1px solid #ccc;"><strong style="color: green;">${result.Mark}/100</strong></td>
            </tr>
          </table>
    
          <p style="margin-top: 20px;">בהצלחה בהמשך! 🎓</p>
        </div>
      `
      };
  
      console.log("שולח מייל...");
      await transporter.sendMail(mailOptions);
      console.log("מייל נשלח בהצלחה");
  
      res.status(200).json({ message: "המייל נשלח בהצלחה" });
  
    } catch (error) {
      console.error("=== שגיאה בשליחת מייל ===");
      console.error("פרטי השגיאה:", error);
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
        html: `
    <div style="direction: rtl; font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <h2 style="color: #333;">שלום,</h2>
      <p>קיבלת סיסמה זמנית לצורך התחברות מחדש למערכת.</p>
      
      <div style="margin: 20px 0; padding: 15px; background-color: #e9f7ef; border: 1px solid #2ecc71; border-radius: 5px; text-align: center;">
        <strong style="font-size: 20px; color: #27ae60;">${tempPassword}</strong>
      </div>

      <p>מומלץ להיכנס עם הסיסמה הזו ולבחור סיסמה חדשה בהקדם האפשרי.</p>
      <p style="margin-top: 20px;">בברכה,<br>צוות התמיכה</p>
    </div>
  `
    });
    

    res.json({ message: "סיסמה זמנית נשלחה למייל" });
} catch (err) {
    console.error("שגיאה באיפוס סיסמה:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
}
};


const verifyTempPassword = async (req, res) => {
    const { email, tempPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "משתמש לא נמצא" });
        }

        const isMatch = await bcrypt.compare(tempPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "סיסמה זמנית שגויה" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ 
            success: true, 
            token,
            role: user.role,
            email: user.email
        });
    } catch (err) {
        console.error("שגיאה באימות סיסמה זמנית:", err);
        res.status(500).json({ error: "שגיאה בשרת" });
    }
};

const changePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "משתמש לא נמצא" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "הסיסמה שונתה בהצלחה" });
    } catch (err) {
        console.error("שגיאה בשינוי סיסמה:", err);
        res.status(500).json({ error: "שגיאה בשרת" });
    }
};

module.exports = {
    SendMark,
    forgotPassword,
    verifyTempPassword,
    changePassword
};