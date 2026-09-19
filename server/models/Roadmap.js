const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  skill: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  description: { type: String, default: '' },
  nextStep: { type: String, default: '' },
  resource: { type: String, default: '' },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' }
});

const roadmapSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  careerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Career', required: true },
  careerTitle: { type: String, required: true },
  matchPercentage: { type: Number, default: 0 },
  milestones: [milestoneSchema]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
