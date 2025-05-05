// middleware/checkManagerRole.js

function checkManagerRole(req, res, next) {
    // נוודא שהמשתמש אכן קיים ושהתפקיד שלו הוא "manager"
    if (!req.user || req.user.role !== 'manager') {
        return res.status(403).json({ message: 'גישה אסורה - לא מנהל' });
    }
    next(); // אם הוא מנהל, נמשיך הלאה
}

module.exports = checkManagerRole;
