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
    const { title } = req.params; 
    console.log(title);
    try {
        const NameTest = await Test.findOne({ title });
        if (!NameTest) {
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
                return res.status(404).json({ message: "מבחן לא נמצא" });
            }
            res.status(200).json(updatedTest);
        })
        .catch(err => res.status(500).json({ message: "שגיאה בעדכון", error: err.message }));
}

module.exports={createTest,getTest,getAllTest,deleteTest,updateTest}

