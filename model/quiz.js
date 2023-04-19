// const mongoose = require('mongoose');

// const quizSchema = new mongoose.Schema({
//   question: { type: String, required: true },
//   options: { type: [String], required: true },
//   rightAnswer: { type: Number, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
// });

// module.exports = mongoose.model('quiz', quizSchema);



const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  rightAnswer: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'finished']
  }
});

module.exports = mongoose.model('quiz', quizSchema);
