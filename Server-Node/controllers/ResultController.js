const Result = require('../models/Result');
const Test = require('../models/Test');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// יצירת transporter לשליחת מיילים
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.createResult = async (req, res) => {
    try {
        const { testId, answers, sendEmail } = req.body;
        const studentId = req.user._id;

        // חישוב הציון
        const test = await Test.findById(testId);
        let score = 0;
        let totalQuestions = test.questions.length;

        test.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) {
                score++;
            }
        });

        const percentage = (score / totalQuestions) * 100;

        // שמירת התוצאה
        const result = new Result({
            testId,
            studentId,
            answers,
            score: percentage
        });

        await result.save();

        // שליחת מייל אם המשתמש בחר בכך
        if (sendEmail) {
            const student = await User.findById(studentId);
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: student.email,
                subject: `תוצאות המבחן: ${test.title}`,
                html: `
                    <h1>תוצאות המבחן</h1>
                    <p>שלום ${student.name},</p>
                    <p>הנה תוצאות המבחן "${test.title}":</p>
                    <p>ציון: ${percentage.toFixed(2)}%</p>
                    <p>מספר תשובות נכונות: ${score} מתוך ${totalQuestions}</p>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({ message: 'תוצאה נשמרה בהצלחה' });
    } catch (error) {
        console.error('Error creating result:', error);
        res.status(500).json({ error: 'שגיאה בשמירת התוצאה' });
    }
}; 