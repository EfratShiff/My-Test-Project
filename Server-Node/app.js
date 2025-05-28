const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// חיבור למונגו
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// הגדרת הנתיבים
const userRoutes = require('./routes/UserRoutes');
app.use('/User', userRoutes);

// הגדרת פורט
const PORT = process.env.PORT || 8080;

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 