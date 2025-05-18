    const jwt = require('jsonwebtoken');
    const User = require("../models/UsersModels");
    const bcrypt = require("bcrypt");
    const crypto = require('crypto');
    const nodemailer = require('nodemailer');

    // async function createUser(req, res) { 
    //     const forgotPassword = async (req, res) => {
    //         const { email } = req.body;
          
    //         try {
    //           const user = await User.findOne({ email });
          
    //           if (!user) {
    //             return res.status(404).json({ error: "משתמש לא נמצא" });
    //           }
          
    //           const tempPassword = crypto.randomBytes(4).toString("hex");
    //           const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
          
    //           user.password = hashedTempPassword;
    //           await user.save();
          
    //           const transporter = nodemailer.createTransport({
    //             service: "gmail",
    //             auth: {
    //               user: process.env.EMAIL_USER,
    //               pass: process.env.EMAIL_PASS,
    //             },
    //           });
          
    //           await transporter.sendMail({
    //             from: process.env.EMAIL_USER,
    //             to: email,
    //             subject: "איפוס סיסמה",
    //             text: `הסיסמה הזמנית שלך היא: ${tempPassword}`,
    //           });
          
    //           res.json({ message: "סיסמה זמנית נשלחה למייל" });
    //         } catch (err) {
    //           console.error("שגיאה באיפוס סיסמה:", err);
    //           res.status(500).json({ error: "שגיאה בשרת" });
    //         }
    //       }; 
    //     try {
    //         const { name, email, password, role } = req.body;
    //         const saltRounds = 10; 
    //         const hashedPassword = await bcrypt.hash(password, saltRounds);
    //         const newUser = new User({
    //             name,
    //             email,
    //             password: hashedPassword, 
    //             role
    //         });
    //         await newUser.save();
    //         const token = jwt.sign(
    //             { userId: newUser._id, role: newUser.role }, 
    //             process.env.JWT_SECRET,
    //             { expiresIn: '10h' }
    //         );

    //         res.status(201).json({
    //             user: newUser,
    //             token: token
    //         });

    //     } catch (error) {
    //         res.status(500).send('Error creating user');
    //     }
    // }
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

    // פונקציה עצמאית
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
        const { name,email } = req.params; 
        console.log(name,email);
        try {
            const NameUser = await User.findOne({ name });
            console.log(NameUser);
            
            if (!NameUser) {
                return res.status(404).json({ message: 'user not found' });
            }
            await User.deleteOne({ name });
            return res.status(200).json({ message: 'user deleted successfully' });
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

    // ** פונקציה חדשה לאיפוס סיסמה **
    async function resetPassword(req, res) {
        const { email } = req.body;
        console.log('Received reset password request for:', email);
    
        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: 'User not found' });
            }
    
            const tempPassword = crypto.randomBytes(6).toString('hex');
            const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
            user.password = hashedTempPassword;
            await user.save();
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
    
            const mailOptions = {
                from: process.env.EMAIL_USER, // עדיף שהמייל ישלח מהכתובת הזו
                to: email,
                subject: 'Your temporary password',
                text: `Your temporary password is: ${tempPassword}`
            };
    
            try {
                await transporter.sendMail(mailOptions);
                console.log('Email sent successfully');
                res.status(200).json({ message: 'Temporary password sent to email' });
            } catch (error) {
                console.error('Error sending email:', error);
                res.status(500).json({ message: 'Failed to send email' });
            }
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
    

    module.exports = { createUser, deleteUser, getUser, getUserById, getAllUser, resetPassword,forgotPassword };
