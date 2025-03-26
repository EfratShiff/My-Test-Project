// const Test=require("../models/TestModels")

// const bcrypt = require("bcrypt");

// async function createTest(req,res){//post- הוספת נתונים חדשים
//     let newTest = await new Test(req.body)
//         await newTest.save()//שומר אותו ב DATA BASE
//         res.send(newTest)
//         console.log("controller");
// }

// async function getTest(req, res) {
//     // שליפת ה-title מה-URL
//     const { title } = req.params;
//     console.log("title "+title);
//     // בדוק אם ה-title הגיע
//     if (!title) {
//         return res.status(400).json({ message: 'Title parameter is missing' });
//     }
//     // חפש את המבחן לפי ה-title
//     try {
//         let test = await Test.findOne({ title }); // הפונקציה משתמשת ב-Test (המודל)
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



// async function getAllTest(req, res) {
//     // חפש את המבחן לפי ה-title
//     try {
//         let test = await Test.find(); // הפונקציה משתמשת ב-Test (המודל)
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
//     const { title } = req.params; // מקבלים את שם המשתמש והסיסמה מה-URL
//     console.log(title);
//     try {
//         const NameTest = await Test.findOne({ title });
//         if (!NameTest) {
//             return res.status(404).json({ message: 'Test not found' });
//         }
//         // מחיקת המשתמש אם הסיסמה תואמת
//         await Test.deleteOne({ title });
//         return res.status(200).json({ message: 'Test deleted successfully' });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Server error' });
//     }
// }
// function updateTest(req, res) {
//     const { title } = req.params; // קבלת ה-title מה-URL

//     Test.findOneAndUpdate({ title: title }, req.body, { new: true, runValidators: true })
//         .then(updatedTest => {
//             if (!updatedTest) {
//                 return res.status(404).json({ message: "מבחן לא נמצא" });
//             }
//             res.status(200).json(updatedTest);
//         })
//         .catch(err => res.status(500).json({ message: "שגיאה בעדכון", error: err.message }));
// }


// module.exports={createTest,getTest,getAllTest,deleteTest,updateTest}

const Test = require("../models/TestModels");

async function createTest(req, res) {  // הוספת מבחן חדש
    let newTest = await new Test(req.body);
    await newTest.save();  // שומר את המבחן במסד נתונים
    res.send(newTest);
    console.log("controller");
}

async function getTest(req, res) {
    const { title } = req.params;
    console.log("title " + title);

    // בדוק אם ה-title הגיע
    if (!title) {
        return res.status(400).json({ message: 'Title parameter is missing' });
    }

    try {
        let test = await Test.findOne({ title });
        console.log("test" + test);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json(test);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getAllTest(req, res) {
    try {
        let tests = await Test.find();
        console.log("tests" + tests);
        if (!tests) {
            return res.status(404).json({ message: 'No tests found' });
        }
        res.status(200).json(tests);
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

async function deleteTest(req, res) {
    const { title } = req.params;
    console.log(title);
    try {
        const test = await Test.findOne({ title });
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }
        await Test.deleteOne({ title });
        return res.status(200).json({ message: 'Test deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

function updateTest(req, res) {
    const { title } = req.params;

    Test.findOneAndUpdate({ title: title }, req.body, { new: true, runValidators: true })
        .then(updatedTest => {
            if (!updatedTest) {
                return res.status(404).json({ message: "Test not found" });
            }
            res.status(200).json(updatedTest);
        })
        .catch(err => res.status(500).json({ message: "Error updating test", error: err.message }));
}

module.exports = { createTest, getTest, getAllTest, deleteTest, updateTest };
