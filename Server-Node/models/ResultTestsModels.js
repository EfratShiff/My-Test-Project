        const mongoose = require('mongoose');

        const ResultSchema = new mongoose.Schema({
            TestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true }, // מזהה המבחן
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // מזהה התלמיד
            answers: [{
                questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // מזהה השאלה
                selectedOptionIndex: { type: Number, required: true } // האינדקס של התשובה שהסטודנט בחר
            }],
            Mark: { 
                type: Number, 
                required: false, 
                default: 0 
            },
            submitDate: { type: Date, default: Date.now } // תאריך ההגשה
        });
        const Result = mongoose.model('ResultSchema', ResultSchema);
        module.exports = Result;
