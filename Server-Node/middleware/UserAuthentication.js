// const jwt = require('jsonwebtoken');

// function authenticateToken(req, res, next) {
//     const token = req.header('Authorization')?.replace('Bearer ', ''); // מקבל את הטוקן מהכותרת של הבקשה
//     if (!token) return res.status(403).send('Access denied'); // אם אין טוקן

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // מאמת את הטוקן
//         req.user = decoded; // שומר את המידע של המשתמש ב-req.user
//         next(); // אם הטוקן תקין, ממשיכים לפונקציה הבאה
//     } catch (error) {
//         res.status(400).send('Invalid token'); // אם הטוקן לא תקין
//     }
// }

// module.exports = authenticateToken;
