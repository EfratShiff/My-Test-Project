// authMiddleware.js
const jwt = require('jsonwebtoken');

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      console.log('📦 Token received:', token);
  
      if (!token) {
        console.log('⛔ No token provided');
        return res.status(401).json({ error: 'No token provided' });
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔑 Decoded token:', decoded);
  
        req.user = decoded;
  
        if (!allowedRoles.includes(decoded.role)) {
          console.log('❌ Access denied for role:', decoded.role);
          return res.status(403).json({ error: 'Access denied' });
        }
  
        console.log('✅ Access granted for role:', decoded.role);
        next();
      } catch (err) {
        console.log('❗ Invalid token:', err.message);
        return res.status(401).json({ error: 'Invalid token' });
      }
    };
  }
  

module.exports = authorizeRoles;
