// const Test=require("../models/TestModels")

// const bcrypt = require("bcrypt");

// async function createTest(req, res) {
//     try {
//         //console.log("תאריך שהתקבל מהקליינט:", req.body.lastDate);
//         let newTest = new Test(req.body);
//         await newTest.save();
//         //console.log("controller");
//         res.send(newTest);
//     } catch (err) {
//         //console.error("שגיאה בשמירת מבחן:", err.message);
//         res.status(500).send({ error: "שגיאה ביצירת מבחן חדש" });
//     }
// }


// async function getTest(req, res) {
//     const { id } = req.params;
//     console.log("ID שהתקבל:", id);

//     if (!id) {
//         return res.status(400).json({ message: 'Missing test ID' });
//     }

//     try {
//         const test = await Test.findById(id);
//         if (!test) {
//             return res.status(404).json({ message: 'Test not found' });
//         }
//         res.json(test);
//     } catch (err) {
//         console.error("שגיאה בשליפת מבחן:", err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }



// async function getAllTest(req, res) {
//     try {
//         let test = await Test.find(); 
//          console.log("test"+test);
//         if (!test) {
//             return res.status(404).json({ message: 'Test not found' });
//         }
//         res.status(200).json(test);
//     } catch (error) {
//         console.log('Error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }


// async function deleteTest(req, res) {
//     const { id } = req.params;
//     console.log("מזהה מבחן למחיקה:", id);
//     console.log("headers:", req.headers);
//     console.log("משתמש מבקש:", req.user);
    
//     if (!id) {
//         console.log("לא התקבל מזהה מבחן");
//         return res.status(400).json({ message: 'לא התקבל מזהה מבחן' });
//     }

//     try {
//         console.log("מחפש מבחן במסד הנתונים...");
//         const test = await Test.findById(id);
//         console.log("תוצאת חיפוש:", test);

//         if (!test) {
//             console.log("לא נמצא מבחן עם המזהה:", id);
//             return res.status(404).json({ message: 'מבחן לא נמצא' });
//         }

//         // בדיקה שהמורה המחובר הוא זה שיצר את המבחן
//         const teacherId = req.user?.userId;
//         console.log("מזהה מורה מהטוקן:", teacherId);
//         console.log("מזהה מורה של המבחן:", test.teacherId?.toString());
        
//         if (!teacherId) {
//             console.log("לא נמצא מזהה מורה בטוקן");
//             return res.status(401).json({ message: 'לא אותרת כמורה מחובר' });
//         }

//         if (test.teacherId.toString() !== teacherId) {
//             console.log("ניסיון למחוק מבחן של מורה אחר");
//             return res.status(403).json({ message: 'אין לך הרשאה למחוק מבחן זה' });
//         }

//         console.log("מתחיל למחוק את המבחן...");
//         await Test.findByIdAndDelete(id);
//         console.log("מבחן נמחק בהצלחה:", id);
//         return res.status(200).json({ message: 'המבחן נמחק בהצלחה' });
//     } catch (err) {
//         console.error("שגיאה במחיקת מבחן:", err);
//         return res.status(500).json({ message: 'שגיאה במחיקת המבחן', error: err.message });
//     }
// }
// function updateTest(req, res) {
//     const { id } = req.params;
//     console.log("מזהה מבחן שהתקבל:", id);
//     console.log("נתונים שהתקבלו לעדכון:", req.body);

//     // מוצא את המבחן הקיים
//     Test.findById(id)
//         .then(existingTest => {
//             if (!existingTest) {
//                 console.log("לא נמצא מבחן עם המזהה:", id);
//                 return res.status(404).json({ message: "מבחן לא נמצא" });
//             }

//             // מעדכן את כל השדות שנשלחו
//             if (req.body.title) existingTest.title = req.body.title;
//             if (req.body.lastDate) existingTest.lastDate = req.body.lastDate;
//             if (req.body.questions) {
//                 // וידוא שכל השאלות החדשות מכילות את כל השדות הנדרשים
//                 const validQuestions = req.body.questions.map(q => ({
//                     questionText: q.questionText,
//                     options: q.options,
//                     correctAnswer: q.correctAnswer,
//                     timeLimit: q.timeLimit || 0
//                 }));
//                 existingTest.questions = validQuestions;
//             }

//             // שומר את המבחן המעודכן
//             return existingTest.save();
//         })
//         .then(updatedTest => {
//             if (!updatedTest) {
//                 return res.status(404).json({ message: "מבחן לא נמצא" });
//             }
//             console.log("מבחן עודכן בהצלחה:", updatedTest);
//             res.status(200).json(updatedTest);
//         })
//         .catch(err => {
//             console.error("שגיאה בעדכון מבחן:", err);
//             res.status(500).json({ message: "שגיאה בעדכון", error: err.message });
//         });
// }

// module.exports={createTest,getTest,getAllTest,deleteTest,updateTest}

const Test=require("../models/TestModels")

const bcrypt = require("bcrypt");

async function createTest(req, res) {
    try {
        console.log("תאריך שהתקבל מהקליינט:", req.body.lastDate);
        let newTest = new Test(req.body);
        await newTest.save();
        console.log("controller");
        res.send(newTest);
    } catch (err) {
        console.error("שגיאה בשמירת מבחן:", err.message);
        res.status(500).send({ error: "שגיאה ביצירת מבחן חדש" });
    }
}


async function getTest(req, res) {
    const { id } = req.params;
    console.log("ID שהתקבל:", id);

    if (!id) {
        return res.status(400).json({ message: 'Missing test ID' });
    }

    try {
        const test = await Test.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.json(test);
    } catch (err) {
        console.error("שגיאה בשליפת מבחן:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
}



async function getAllTest(req, res) {
    try {
        let test = await Test.find(); 
         console.log("test"+test);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json(test);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


async function deleteTest(req, res) {
    const { id } = req.params;
    console.log("מזהה מבחן למחיקה:", id);
    console.log("headers:", req.headers);
    console.log("משתמש מבקש:", req.user);
    
    if (!id) {
        console.log("לא התקבל מזהה מבחן");
        return res.status(400).json({ message: 'לא התקבל מזהה מבחן' });
    }

    try {
        console.log("מחפש מבחן במסד הנתונים...");
        const test = await Test.findById(id);
        console.log("תוצאת חיפוש:", test);

        if (!test) {
            console.log("לא נמצא מבחן עם המזהה:", id);
            return res.status(404).json({ message: 'מבחן לא נמצא' });
        }

        // בדיקה שהמורה המחובר הוא זה שיצר את המבחן
        const teacherId = req.user?.userId;
        console.log("מזהה מורה מהטוקן:", teacherId);
        console.log("מזהה מורה של המבחן:", test.teacherId?.toString());
        
        if (!teacherId) {
            console.log("לא נמצא מזהה מורה בטוקן");
            return res.status(401).json({ message: 'לא אותרת כמורה מחובר' });
        }

        if (test.teacherId.toString() !== teacherId) {
            console.log("ניסיון למחוק מבחן של מורה אחר");
            return res.status(403).json({ message: 'אין לך הרשאה למחוק מבחן זה' });
        }

        console.log("מתחיל למחוק את המבחן...");
        await Test.findByIdAndDelete(id);
        console.log("מבחן נמחק בהצלחה:", id);
        return res.status(200).json({ message: 'המבחן נמחק בהצלחה' });
    } catch (err) {
        console.error("שגיאה במחיקת מבחן:", err);
        return res.status(500).json({ message: 'שגיאה במחיקת המבחן', error: err.message });
    }
}
function updateTest(req, res) {
    const { id } = req.params;
    console.log("מזהה מבחן שהתקבל:", id);
    console.log("נתונים שהתקבלו לעדכון:", req.body);

    // מוצא את המבחן הקיים
    Test.findById(id)
        .then(existingTest => {
            if (!existingTest) {
                console.log("לא נמצא מבחן עם המזהה:", id);
                return res.status(404).json({ message: "מבחן לא נמצא" });
            }

            // מעדכן את כל השדות שנשלחו
            if (req.body.title) existingTest.title = req.body.title;
            if (req.body.lastDate) existingTest.lastDate = req.body.lastDate;
            if (req.body.questions) {
                // וידוא שכל השאלות החדשות מכילות את כל השדות הנדרשים
                const validQuestions = req.body.questions.map(q => ({
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    timeLimit: q.timeLimit || 0
                }));
                existingTest.questions = validQuestions;
            }

            // שומר את המבחן המעודכן
            return existingTest.save();
        })
        .then(updatedTest => {
            if (!updatedTest) {
                return res.status(404).json({ message: "מבחן לא נמצא" });
            }
            console.log("מבחן עודכן בהצלחה:", updatedTest);
            res.status(200).json(updatedTest);
        })
        .catch(err => {
            console.error("שגיאה בעדכון מבחן:", err);
            res.status(500).json({ message: "שגיאה בעדכון", error: err.message });
        });
}

async function getTestAverageScore(req, res) {
    const { id } = req.params;

    try {
        const test = await Test.findById(id);
        if (!test) {
            return res.status(404).json({ message: 'מבחן לא נמצא' });
        }

        const results = test.studentResults;

        if (!results || results.length === 0) {
            return res.status(200).json({ averageScore: 0 });
        }

        const total = results.reduce((sum, result) => sum + result.score, 0);
        const average = total / results.length;

        return res.status(200).json({ averageScore: average });
    } catch (error) {
        console.error("שגיאה בחישוב ממוצע:", error);
        return res.status(500).json({ message: 'שגיאה בשרת' });
    }
}


module.exports={createTest,getTest,getAllTest,deleteTest,updateTest,getTestAverageScore}