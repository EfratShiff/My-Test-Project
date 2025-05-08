const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    questions: [{
        questionText: { type: String, required: true }, 
        options: [{ type: String, required: true }], 
        correctAnswer: { type: String, required: true }, 
    }],
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timeLimit: { type: Number, default: 0 },
});

const Test = mongoose.model('TestSchema', TestSchema);
module.exports = Test;
