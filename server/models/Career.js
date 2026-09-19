const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  requiredSkills: {
    type: [String],
    required: true,
    default: []
  },
  recommendedSkills: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
