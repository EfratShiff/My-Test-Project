function checkManagerRole(req, res, next) {
    if (!req.user || req.user.role !== 'manager') {
        return res.status(403).json({ message: 'גישה אסורה - לא מנהל' });
    }
    next(); 
}

module.exports = checkManagerRole;
