const mongoose = require('mongoose');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');
const Career = require('../models/Career');
const { calculateSkillGap } = require('../services/skillMatchingService');
const { calculateSkillPriorities } = require('../services/priorityService');
const { generateRecommendations } = require('../services/aiRecommendationService');
const { buildMilestones } = require('../services/roadmapService');

const generateRoadmap = async (req, res) => {
  try {
    const { studentId, careerId } = req.body;

    if (!studentId || !careerId) {
      return res.status(400).json({ error: 'studentId and careerId are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(careerId)) {
      return res.status(400).json({ error: 'Invalid studentId or careerId.' });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const career = await Career.findById(careerId);
    if (!career) return res.status(404).json({ error: 'Career not found.' });

    const uniqueStudentSkills = [...new Set(student.skills || [])];
    const uniqueCareerSkills = [...new Set(career.requiredSkills || [])];
    const gapAnalysis = calculateSkillGap(uniqueStudentSkills, uniqueCareerSkills);
    const priorities = calculateSkillPriorities(gapAnalysis.missingSkills, career.title, gapAnalysis.matchedSkills);
    const skillGapData = { ...gapAnalysis, priorities };

    let recommendationData = null;
    try {
      recommendationData = await generateRecommendations({
        career: career.title,
        matchedSkills: gapAnalysis.matchedSkills,
        missingSkills: gapAnalysis.missingSkills,
        partialSkills: gapAnalysis.partialSkills,
        priorities
      });
    } catch (e) {
      console.warn('Recommendation API failed, using fallback milestones.');
    }

    const milestones = buildMilestones(skillGapData, recommendationData);

    const roadmap = await Roadmap.findOneAndUpdate(
      { studentId: student._id, careerId: career._id },
      { studentId: student._id, careerId: career._id, careerTitle: career.title, matchPercentage: gapAnalysis.matchPercentage, milestones },
      { upsert: true, new: true }
    );

    return res.status(200).json(roadmap);
  } catch (error) {
    console.error('generateRoadmap error:', error);
    return res.status(500).json({ error: 'Failed to generate roadmap.' });
  }
};

const getRoadmap = async (req, res) => {
  try {
    const { studentId, careerId } = req.params;
    const roadmap = await Roadmap.findOne({ studentId, careerId });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found.' });
    return res.status(200).json(roadmap);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch roadmap.' });
  }
};

const updateMilestone = async (req, res) => {
  try {
    const { roadmapId, milestoneId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Not Started', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use: Not Started, In Progress, Completed' });
    }

    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found.' });

    const milestone = roadmap.milestones.id(milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found.' });

    milestone.status = status;
    await roadmap.save();

    return res.status(200).json(roadmap);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update milestone.' });
  }
};

const getProgress = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.roadmapId);
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found.' });

    const total = roadmap.milestones.length;
    const completed = roadmap.milestones.filter(m => m.status === 'Completed').length;
    const inProgress = roadmap.milestones.filter(m => m.status === 'In Progress').length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const currentMilestone = roadmap.milestones.find(m => m.status !== 'Completed');

    return res.status(200).json({
      total,
      completed,
      inProgress,
      remaining: total - completed,
      percentage,
      currentSkill: currentMilestone ? currentMilestone.skill : null
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch progress.' });
  }
};

const getCareers = async (req, res) => {
  try {
    const careers = await Career.find({}, 'title description requiredSkills');
    return res.status(200).json(careers);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch careers.' });
  }
};

const upsertStudent = async (req, res) => {
  try {
    const { name, email, skills } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required.' });

    let student = await User.findOne({ email: email.toLowerCase() });
    if (student) {
      if (skills && Array.isArray(skills)) {
        student.skills = skills;
        await student.save();
      }
    } else {
      student = await User.create({ name, email: email.toLowerCase(), skills: skills || [] });
    }
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save student.' });
  }
};

module.exports = { generateRoadmap, getRoadmap, updateMilestone, getProgress, getCareers, upsertStudent };
