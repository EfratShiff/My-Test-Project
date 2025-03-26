const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    title: { type: String, required: true }, // שם המבחן
    questions: [{
        questionText: { type: String, required: true }, // הטקסט של השאלה
        options: [{ type: String, required: true }], // תשובות אפשריות
        correctAnswer: { type: String, required: true }, // התשובה הנכונה
    }],
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // המורה שיצר את המבחן
    timeLimit: { type: Number, default: 0 }, // זמן מוגבל למבחן (ב minutes) - אם יש צורך
});

const Test = mongoose.model('Test', TestSchema);
module.exports = Test;
