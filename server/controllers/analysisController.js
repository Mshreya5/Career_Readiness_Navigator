const mongoose = require('mongoose');
const User = require('../models/User');
const Career = require('../models/Career');
const Assessment = require('../models/Assessment');
const { calculateSkillGap } = require('../services/skillMatchingService');
const { calculateSkillPriorities } = require('../services/priorityService');
const { generateRecommendations } = require('../services/aiRecommendationService');

const getSkillGap = async (req, res) => {
  try {
    const { studentId, careerId } = req.body;

    if (!studentId || !careerId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Both studentId and careerId are required.'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid studentId format.'
      });
    }
    if (!mongoose.Types.ObjectId.isValid(careerId)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid careerId format.'
      });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Student not found.'
      });
    }

    const career = await Career.findById(careerId);
    if (!career) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Career not found.'
      });
    }

    const studentSkills = student.skills || [];
    const careerRequiredSkills = career.requiredSkills || [];

    if (careerRequiredSkills.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Selected career has no required skills listed in the database.'
      });
    }

    const studentAssessments = await Assessment.find({ studentId }).sort({ completedAt: -1 });

    const uniqueStudentSkills = [...new Set(studentSkills)];
    const uniqueCareerSkills = [...new Set(careerRequiredSkills)];

    const gapAnalysis = calculateSkillGap(uniqueStudentSkills, uniqueCareerSkills, studentAssessments);

    const priorities = calculateSkillPriorities(
      gapAnalysis.missingSkills,
      career.title,
      gapAnalysis.matchedSkills
    );

    return res.status(200).json({
      career: career.title,
      matchedSkills: gapAnalysis.matchedSkills,
      missingSkills: gapAnalysis.missingSkills,
      partialSkills: gapAnalysis.partialSkills,
      matchPercentage: gapAnalysis.matchPercentage,
      assessmentExplanations: gapAnalysis.assessmentExplanations || [],
      priorities
    });

  } catch (error) {
    console.error('Error in getSkillGap:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to process skill-gap analysis.'
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { studentId, careerId, career, matchedSkills, missingSkills, partialSkills, priorities } = req.body;

    if (!career && studentId && careerId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ error: 'Validation Error', message: 'Invalid studentId format.' });
      }
      if (!mongoose.Types.ObjectId.isValid(careerId)) {
        return res.status(400).json({ error: 'Validation Error', message: 'Invalid careerId format.' });
      }

      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Not Found', message: 'Student not found.' });
      }

      const careerDoc = await Career.findById(careerId);
      if (!careerDoc) {
        return res.status(404).json({ error: 'Not Found', message: 'Career not found.' });
      }

      const uniqueStudentSkills = [...new Set(student.skills || [])];
      const uniqueCareerSkills = [...new Set(careerDoc.requiredSkills || [])];

      const gapAnalysis = calculateSkillGap(uniqueStudentSkills, uniqueCareerSkills);
      const computedPriorities = calculateSkillPriorities(
        gapAnalysis.missingSkills,
        careerDoc.title,
        gapAnalysis.matchedSkills
      );

      const recommendations = await generateRecommendations({
        career: careerDoc.title,
        matchedSkills: gapAnalysis.matchedSkills,
        missingSkills: gapAnalysis.missingSkills,
        partialSkills: gapAnalysis.partialSkills,
        priorities: computedPriorities
      });

      return res.status(200).json(recommendations);
    }

    if (!career) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Career title is required (or provide studentId and careerId).'
      });
    }

    const payloadMissingSkills = Array.isArray(missingSkills) ? missingSkills : [];
    const payloadMatchedSkills = Array.isArray(matchedSkills) ? matchedSkills : [];
    const payloadPartialSkills = Array.isArray(partialSkills) ? partialSkills : [];

    let computedPriorities = priorities;
    if (!Array.isArray(computedPriorities) || computedPriorities.length === 0) {
      computedPriorities = calculateSkillPriorities(payloadMissingSkills, career, payloadMatchedSkills);
    }

    const recommendations = await generateRecommendations({
      career,
      matchedSkills: payloadMatchedSkills,
      missingSkills: payloadMissingSkills,
      partialSkills: payloadPartialSkills,
      priorities: computedPriorities
    });

    return res.status(200).json(recommendations);

  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to generate recommendations.'
    });
  }
};

module.exports = {
  getSkillGap,
  getRecommendations
};
