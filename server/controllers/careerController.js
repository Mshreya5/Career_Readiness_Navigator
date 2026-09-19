const mongoose = require('mongoose');
const Career = require('../models/Career');

/**
 * GET /api/careers
 * Returns the list of available careers for the frontend's Career Paths view.
 */
const getCareers = async (req, res, next) => {
  try {
    const careers = await Career.find({}, 'title description requiredSkills recommendedSkills');
    return res.status(200).json(careers);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/careers/:id
 * Returns a single career by id.
 */
const getCareerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid career ID.' });
    }

    const career = await Career.findById(id);
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found.' });
    }

    return res.status(200).json(career);
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /api/careers/:id/skills
 * Returns just the required skills for a career (used by the Skill Intelligence module input).
 */
const getCareerSkills = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid career ID.' });
    }

    const career = await Career.findById(id, 'title requiredSkills recommendedSkills');
    if (!career) {
      return res.status(404).json({ success: false, message: 'Career not found.' });
    }

    return res.status(200).json({
      career: career.title,
      requiredSkills: career.requiredSkills || [],
      recommendedSkills: career.recommendedSkills || []
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /api/careers
 * Body: { title, description?, requiredSkills?, recommendedSkills? }
 * Optional admin-style endpoint to add a career to the database.
 */
const createCareer = async (req, res, next) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
      return res.status(400).json({ success: false, message: 'Career title is required.' });
    }

    const cleanArray = (value) => {
      if (value === undefined) return [];
      if (!Array.isArray(value)) return null;
      return [...new Set(value.filter((s) => typeof s === 'string' && s.trim() !== '').map((s) => s.trim()))];
    };

    const requiredSkills = cleanArray(req.body.requiredSkills);
    const recommendedSkills = cleanArray(req.body.recommendedSkills);

    if (requiredSkills === null || recommendedSkills === null) {
      return res.status(400).json({ success: false, message: 'Skill fields must be arrays of strings.' });
    }

    const existing = await Career.findOne({ title });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A career with this title already exists.' });
    }

    const career = await Career.create({
      title,
      description: typeof req.body.description === 'string' ? req.body.description.trim() : '',
      requiredSkills,
      recommendedSkills
    });

    return res.status(201).json(career);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getCareers, getCareerById, getCareerSkills, createCareer };
