// const mongoose = require('mongoose');

// const TestSchema = new mongoose.Schema({
//     title: { type: String, required: true }, 
//     questions: [{
//         questionText: { type: String, required: true }, 
//         options: [{ type: String, required: true }], 
//         correctAnswer: { type: String, required: true }, 
//     }],
//     teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     timeLimit: { type: Number, default: 0 },
//     lastDate: { type: Date, required: true }
// });

// const Test = mongoose.model('TestSchema', TestSchema);
// module.exports = Test;


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
    lastDate: { type: Date, required: true } // 👈 זה כל מה שצריך
});

const Test = mongoose.model('TestSchema', TestSchema);
module.exports = Test;
