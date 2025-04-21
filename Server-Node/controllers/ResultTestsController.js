
// const Result = require('../models/ResultTestsModels');
// const Test = require('../models/TestModels');

// const mongoose = require('mongoose');

// async function TestCheck(req, res) {
//     try {
//         const { TestId, studentId, answers } = req.body;

//         console.log("📥 Received request body:", req.body);

//         // בדיקת תקינות הקלט
//         if (!TestId || !studentId || !answers || !Array.isArray(answers) || answers.length === 0) {
//             return res.status(400).json({ message: "❌ חסר מידע - יש לוודא ששלחת את כל השדות הנדרשים" });
//         }

//         // המרת מזהים ל-ObjectId
//         const testId = new mongoose.Types.ObjectId(TestId);
//         const studentObjectId = new mongoose.Types.ObjectId(studentId);
//         const formattedAnswers = answers.map(answer => ({
//             questionId: new mongoose.Types.ObjectId(answer.questionId),
//             selectedOptionIndex: answer.selectedOptionIndex
//         }));

//         // שליפת המבחן מהמסד נתונים
//         const test = await Test.findById(testId);
//         if (!test) {
//             console.log("⚠️ מבחן לא נמצא:", TestId);
//             return res.status(404).json({ message: "❌ מבחן לא נמצא במסד הנתונים" });
//         }

//         console.log("✅ מבחן נמצא:", testId);
//         console.log("📌 מספר שאלות במבחן:", test.questions.length);

//         // חישוב ציון
//         const totalQuestions = test.questions.length;
//         console.log(totalQuestions);
//         const pointsPerQuestion = 100 / totalQuestions;
//         console.log(pointsPerQuestion);
//         let score = 0;
        
//         formattedAnswers.forEach(answer => {
//             const question = test.questions.find(q => q._id.toString() === answer.questionId.toString());

//             if (!question) {
//                 console.log(`⚠️ שאלה לא נמצאה במבחן: ${answer.questionId}`);
//                 return;
//             }

//             console.log(`✅ שאלה ${question._id} נמצאה!`);
//             console.log(`🎯 תשובה נכונה: ${question.correctAnswer}`);
//             console.log(`📝 תשובה שנבחרה: ${answer.selectedOptionIndex}`);

//             // בדיקה האם התשובה הנכונה היא אינדקס או טקסט
//             if (question.correctAnswer == answer.selectedOptionIndex) {
//                 console.log("✔️ תשובה נכונה! מוסיף נקודות");
//                 score += pointsPerQuestion;
//             } else {
//                 console.log("❌ תשובה שגויה");
//             }
//         });

//         // עיגול הציון לשתי ספרות אחרי הנקודה
//         score = Math.round(score * 100) / 100;

//         console.log("🏆 ציון סופי:", score);

//         // יצירת מסמך חדש ושמירה במסד הנתונים
//         const result = new Result({
//             TestId: testId,
//             studentId: studentObjectId,
//             answers: formattedAnswers,
//             Mark: score
//         });

//         console.log("📤 שמירת תוצאה במסד הנתונים:", result);

//         await result.save();
//         res.status(201).json({ message: "✅ תוצאה נשמרה בהצלחה", result });

//     } catch (error) {
//         console.error("❌ שגיאה בשמירת התוצאה:", error);
//         res.status(500).json({ message: "❌ שגיאה בשמירת התוצאה", error });
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

// module.exports = { TestCheck, getStudentTestResult, createResultTest };


const Result = require('../models/ResultTestsModels');
const Test = require('../models/TestModels');
const mongoose = require('mongoose');

async function TestCheck(req, res) {
    try {
        const { TestId, studentId, answers } = req.body;

        console.log("📥 קלט שהתקבל:", JSON.stringify(req.body, null, 2));

        if (!TestId || !studentId || !answers || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: "❌ חסר מידע - יש לוודא ששלחת את כל השדות הנדרשים" });
        }

        const testId = new mongoose.Types.ObjectId(TestId);
        const studentObjectId = new mongoose.Types.ObjectId(studentId);
        const formattedAnswers = answers.map(answer => ({
            questionId: new mongoose.Types.ObjectId(answer.questionId),
            selectedOptionIndex: answer.selectedOptionIndex
        }));

        const test = await Test.findById(testId);
        if (!test) {
            console.log("⚠️ מבחן לא נמצא:", TestId);
            return res.status(404).json({ message: "❌ מבחן לא נמצא במסד הנתונים" });
        }

        console.log("✅ מבחן נמצא:", testId);
        console.log("📌 מספר שאלות במבחן:", test.questions.length);

        const totalQuestions = test.questions.length;
        const pointsPerQuestion = 100 / totalQuestions;
        let score = 0;

        formattedAnswers.forEach(answer => {
            const question = test.questions.find(q => q._id.toString() === answer.questionId.toString());

            if (!question) {
                console.log(`⚠️ שאלה לא נמצאה במבחן: ${answer.questionId}`);
                return;
            }

            console.log(`✅ שאלה ${question._id} נמצאה!`);
            console.log(`🎯 תשובה נכונה: ${question.correctAnswer}`);
            console.log(`📝 תשובה שנבחרה: ${answer.selectedOptionIndex}`);

            // בדיקה האם התשובה היא מספר (אינדקס) או טקסט
            if (typeof question.correctAnswer === "number") {
                if (question.correctAnswer === answer.selectedOptionIndex) {
                    console.log("✔️ תשובה נכונה! מוסיף נקודות");
                    score += pointsPerQuestion;
                } else {
                    console.log("❌ תשובה שגויה");
                }
            } else if (typeof question.correctAnswer === "string") {
                const correctAnswerIndex = question.options.indexOf(question.correctAnswer);
                if (correctAnswerIndex === answer.selectedOptionIndex) {
                    console.log("✔️ תשובה נכונה! מוסיף נקודות");
                    score += pointsPerQuestion;
                } else {
                    console.log("❌ תשובה שגויה");
                }
            } else {
                console.log("⚠️ שגיאה: `correctAnswer` לא בפורמט תקין!", question.correctAnswer);
            }
        });

        score = Math.round(score * 100) / 100;
        console.log("🏆 ציון סופי:", score);

        const result = new Result({
            TestId: testId,
            studentId: studentObjectId,
            answers: formattedAnswers,
            Mark: score
        });

        console.log("📤 שמירת תוצאה במסד הנתונים:", result);

        await result.save();
        res.status(201).json({ message: "✅ תוצאה נשמרה בהצלחה", result });

    } catch (error) {
        console.error("❌ שגיאה בשמירת התוצאה:", error);
        res.status(500).json({ message: "❌ שגיאה בשמירת התוצאה", error });
    }
}

async function getStudentTestResult(req, res) {
    try {
        const { studentId, TestId } = req.params;

        if (!studentId || !TestId) {
            return res.status(400).json({ message: "❌ יש לספק מזהה תלמיד ומזהה מבחן" });
        }

        const result = await Result.findOne({ studentId, TestId });
        if (!result) {
            return res.status(404).json({ message: "❌ לא נמצאה תוצאה עבור תלמיד זה במבחן זה" });
        }

        res.status(200).json({ result });
    } catch (error) {
        console.error("❌ שגיאה בשליפת תוצאה:", error);
        res.status(500).json({ message: "❌ שגיאה בשליפת תוצאה", error });
    }
}

async function createResultTest(req, res) {
    try {
        const { TestId, studentId, answers } = req.body;

        const test = await Test.findById(TestId);
        if (!test) {
            return res.status(404).json({ error: "❌ מבחן לא נמצא. יש לבדוק את TestId." });
        }

        let correctAnswersCount = 0;
        test.questions.forEach((question) => {
            const studentAnswer = answers.find(a => a.questionId.toString() === question._id.toString());
            if (studentAnswer) {
                if (typeof question.correctAnswer === "number" && question.correctAnswer === studentAnswer.selectedOptionIndex) {
                    correctAnswersCount++;
                } else if (typeof question.correctAnswer === "string") {
                    const correctAnswerIndex = question.options.indexOf(question.correctAnswer);
                    if (correctAnswerIndex === studentAnswer.selectedOptionIndex) {
                        correctAnswersCount++;
                    }
                }
            }
        });

        const finalScore = (correctAnswersCount / test.questions.length) * 100;

        const newResult = new Result({
            TestId,
            studentId,
            answers,
            Mark: finalScore
        });

        await newResult.save();
        res.status(201).json(newResult);
    } catch (error) {
        console.error("❌ שגיאה:", error);
        res.status(500).json({ error: "❌ שגיאה פנימית בשרת" });
    }
}

module.exports = { TestCheck, getStudentTestResult, createResultTest };

