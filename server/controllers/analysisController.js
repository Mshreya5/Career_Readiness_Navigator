const mongoose = require('mongoose');
const User = require('../models/User');
const Career = require('../models/Career');
const { calculateSkillGap } = require('../services/skillMatchingService');
const { calculateSkillPriorities } = require('../services/priorityService');
const { generateRecommendations } = require('../services/aiRecommendationService');

/**
 * Controller: POST /api/analysis/skill-gap
 * Calculates deterministic skill gap analysis and priorities between student skills and career required skills
 */
const getSkillGap = async (req, res) => {
  try {
    const { studentId, careerId } = req.body;

    // 1. Validation for missing fields
    if (!studentId || !careerId) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Both studentId and careerId are required.'
      });
    }

    // 2. Validation for valid Mongoose ObjectIds
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

    // 3. Fetch Student and Career from database
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

    // 4. Extract skills
    const studentSkills = student.skills || [];
    const careerRequiredSkills = career.requiredSkills || [];

    if (careerRequiredSkills.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Selected career has no required skills listed in the database.'
      });
    }

    // 5. Deduplicate skills arrays
    const uniqueStudentSkills = [...new Set(studentSkills)];
    const uniqueCareerSkills = [...new Set(careerRequiredSkills)];

    // 6. Calculate skill gap analysis
    const gapAnalysis = calculateSkillGap(uniqueStudentSkills, uniqueCareerSkills);

    // 7. Calculate priorities for missing skills
    const priorities = calculateSkillPriorities(
      gapAnalysis.missingSkills,
      career.title,
      gapAnalysis.matchedSkills
    );

    // 8. Return structured JSON response
    return res.status(200).json({
      career: career.title,
      matchedSkills: gapAnalysis.matchedSkills,
      missingSkills: gapAnalysis.missingSkills,
      partialSkills: gapAnalysis.partialSkills,
      matchPercentage: gapAnalysis.matchPercentage,
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

/**
 * Controller: POST /api/analysis/recommendations
 * Generates AI or fallback recommendations based on skill gap output
 */
const getRecommendations = async (req, res) => {
  try {
    const { career, matchedSkills, missingSkills, partialSkills, priorities } = req.body;

    if (!career) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Career title is required.'
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
