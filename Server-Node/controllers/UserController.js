const User=require("../models/UsersModels")
const bcrypt = require("bcrypt");
async function createUser(req,res){//post- הוספת נתונים חדשים
    let newUser = await new User(req.body)
        await newUser.save()//שומר אותו ב DATA BASE
        res.send(newUser)
}

// async function deleteUser(req, res) {//DELETE מחיקת נתונים
//     let nameUser = req.params.name
//     let passwordUser = req.params.passwordUser//שולף את הNAME
//     let p = await User.findOne({ name: nameUser })//מחפש את הNAME
//     await User.findByIdAndUpdate(p.UserId, { password: passwordUser })//מעדכן את הPASSWORD
//     await User.deleteOne({ name: nameUser })
//     res.send("deleted" + p)
// }

async function deleteUser(req, res) {
    const { name, passwordUser } = req.params; // מקבלים את שם המשתמש והסיסמה מה-URL

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
console.log("passwordUser"+passwordUser);
console.log("user.password"+user.password);

        // // השוואת הסיסמה
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


module.exports={createUser,deleteUser}