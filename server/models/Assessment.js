const mongoose = require('mongoose')

const assessmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      index: true
    },
    careerId: {
      type: String,
      default: ''
    },
    skill: {
      type: String,
      required: true
    },
    assessmentType: {
      type: String,
      enum: ['quiz', 'coding'],
      required: true
    },
    questionsAttempted: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Basic', 'Intermediate', 'Strong'],
      default: 'Beginner'
    },
    timeTaken: {
      type: Number,
      default: 0
    },
    testCasesPassed: {
      type: Number,
      default: 0
    },
    testCasesTotal: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: ''
    },
    submissionStatus: {
      type: String,
      default: 'Completed'
    },
    aiFeedback: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Assessment', assessmentSchema)
