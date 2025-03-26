// const Result = require('../models/ResultTestsModels');
// const Test = require('../models/TestModels');

// async function TestCheck(req, res) {//בודקת את המבחן
//     try {
//         const { TestId, studentId, answers } = req.body;
//         // בדיקה שהמשתנים קיימים
//         if (!TestId || !studentId || !answers) {
//             return res.status(400).json({ message: "חסר מידע - יש לוודא ששלחת את כל השדות הנדרשים" });
//         }
//         // שליפת המבחן מהמסד נתונים
//         const test = await Test.findById(TestId.trim());
//         if (!test) return res.status(404).json({ message: "מבחן לא נמצא" });
//         // קביעת משקל כל שאלה
//         const totalQuestions = test.questions.length;
//         const pointsPerQuestion = 100 / totalQuestions;
//         let score = 0;
//         // יצירת מערך תשובות מסודר
//         const studentAnswers = new Array(totalQuestions).fill(null);
//         answers.forEach((answer) => {
//             studentAnswers[answer.questionIndex] = answer.selectedOption || null;
//         });
//         // חישוב הציון
//         test.questions.forEach((question, index) => {
//             if (studentAnswers[index] === question.correctAnswer) {
//                 score += pointsPerQuestion;
//             }
//         });
//         // עיגול הציון לשתי ספרות אחרי הנקודה
//         score = Math.round(score * 100) / 100;
//         // שמירת התוצאה במסד נתונים
//         const result = new Result({ 
//             TestId, 
//             studentId, 
//             score, 
//             answers: studentAnswers.map((answer, index) => ({
//                 questionIndex: index,
//                 selectedOption: answer || "לא נבחרה תשובה" // אם לא נבחרה תשובה – מסמנים זאת
//             })) 
//         });
//         await result.save();
//         res.status(201).json({ message: "תוצאה נשמרה בהצלחה", result });
//     } catch (error) {
//         console.error("שגיאה בשמירת התוצאה:", error);
//         res.status(500).json({ message: "שגיאה בשמירת התוצאה", error });
//     }
// }


// async function getStudentTestResult(req, res) {
//     try {
//         const { studentId, TestId } = req.params;
//         // בדיקה האם הפרמטרים קיימים
//         if (!studentId || !TestId) {
//             return res.status(400).json({ message: "יש לספק מזהה תלמיד ומזהה מבחן" });
//         }
//         // שליפת התוצאה ממסד הנתונים
//         const result = await Result.findOne({ studentId, TestId: TestId });
//         if (!result) {
//             return res.status(404).json({ message: "לא נמצאה תוצאה עבור תלמיד זה במבחן זה" });
//         }
//         res.status(200).json({ result });
//     } catch (error) {
//         console.error("שגיאה בשליפת תוצאה:", error);
//         res.status(500).json({ message: "שגיאה בשליפת תוצאה", error });
//     }
// }



// async function createResultTest(req, res) {
//     try {
//         const { TestId, studentId, answers } = req.body;

//         // חיפוש המבחן במסד הנתונים
//         const test = await Test.findById(TestId);
//         if (!test) {
//             return res.status(404).json({ error: "Test not found. Please check the TestId." });
//         }

//         // חישוב הציון
//         let correctAnswersCount = 0;
//         test.questions.forEach((question, index) => {
//             const studentAnswer = answers.find(a => a.questionId.toString() === question._id.toString());
//             if (studentAnswer && question.options[studentAnswer.selectedOptionIndex] === question.correctAnswer) {
//                 correctAnswersCount++;
//             }
//         });

//         const finalScore = (correctAnswersCount / test.questions.length) * 100;

//         // יצירת אובייקט תוצאה חדש ושמירה במסד הנתונים
//         const newResult = new Result({
//             TestId,
//             studentId,
//             answers,
//             Mark: finalScore
//         });

//         await newResult.save();
//         res.status(201).json(newResult);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// module.exports = { createResultTest };



// module.exports = { TestCheck ,getStudentTestResult,createResultTest};



const Result = require('../models/ResultTestsModels');
const Test = require('../models/TestModels');

async function TestCheck(req, res) {  // בודקת את המבחן
    try {
        const { TestId, studentId, answers } = req.body;

        // בדיקה שהמשתנים קיימים
        if (!TestId || !studentId || !answers) {
            return res.status(400).json({ message: "חסר מידע - יש לוודא ששלחת את כל השדות הנדרשים" });
        }

        // שליפת המבחן מהמסד נתונים
        const test = await Test.findById(TestId.trim());
        if (!test) return res.status(404).json({ message: "מבחן לא נמצא" });

        // קביעת משקל כל שאלה
        const totalQuestions = test.questions.length;
        const pointsPerQuestion = 100 / totalQuestions;
        let score = 0;

        // יצירת מערך תשובות מסודר
        const studentAnswers = new Array(totalQuestions).fill(null);
        answers.forEach((answer) => {
            studentAnswers[answer.questionIndex] = answer.selectedOption || null;
        });

        // חישוב הציון
        test.questions.forEach((question, index) => {
            if (studentAnswers[index] === question.correctAnswer) {
                score += pointsPerQuestion;
            }
        });

        // עיגול הציון לשתי ספרות אחרי הנקודה
        score = Math.round(score * 100) / 100;

        // שמירת התוצאה במסד נתונים
        const result = new Result({
            TestId, 
            studentId, 
            score, 
            answers: studentAnswers.map((answer, index) => ({
                questionIndex: index,
                selectedOption: answer || "לא נבחרה תשובה"
            }))
        });

        await result.save();
        res.status(201).json({ message: "תוצאה נשמרה בהצלחה", result });
    } catch (error) {
        console.error("שגיאה בשמירת התוצאה:", error);
        res.status(500).json({ message: "שגיאה בשמירת התוצאה", error });
    }
}

async function getStudentTestResult(req, res) {
    try {
        const { studentId, TestId } = req.params;

        // בדיקה האם הפרמטרים קיימים
        if (!studentId || !TestId) {
            return res.status(400).json({ message: "יש לספק מזהה תלמיד ומזהה מבחן" });
        }

        // שליפת התוצאה ממסד הנתונים
        const result = await Result.findOne({ studentId, TestId: TestId });
        if (!result) {
            return res.status(404).json({ message: "לא נמצאה תוצאה עבור תלמיד זה במבחן זה" });
        }

        res.status(200).json({ result });
    } catch (error) {
        console.error("שגיאה בשליפת תוצאה:", error);
        res.status(500).json({ message: "שגיאה בשליפת תוצאה", error });
    }
}

async function createResultTest(req, res) {
    try {
        const { TestId, studentId, answers } = req.body;

        // חיפוש המבחן במסד הנתונים
        const test = await Test.findById(TestId);
        if (!test) {
            return res.status(404).json({ error: "Test not found. Please check the TestId." });
        }

        // חישוב הציון
        let correctAnswersCount = 0;
        test.questions.forEach((question, index) => {
            const studentAnswer = answers.find(a => a.questionId.toString() === question._id.toString());
            if (studentAnswer && question.options[studentAnswer.selectedOptionIndex] === question.correctAnswer) {
                correctAnswersCount++;
            }
        });

        const finalScore = (correctAnswersCount / test.questions.length) * 100;

        // יצירת אובייקט תוצאה חדש ושמירה במסד הנתונים
        const newResult = new Result({
            TestId,
            studentId,
            answers,
            Mark: finalScore
        });

        await newResult.save();
        res.status(201).json(newResult);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { TestCheck, getStudentTestResult, createResultTest };
