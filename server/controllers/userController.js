const mongoose = require('mongoose');
const User = require('../models/User');
const Career = require('../models/Career');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  skills: user.skills || [],
  selectedCareer: user.selectedCareer || null,
  createdAt: user.createdAt
});

const sanitizeSkills = (skills) => {
  if (!Array.isArray(skills)) return null;
  const cleaned = skills
    .filter((s) => typeof s === 'string' && s.trim() !== '')
    .map((s) => s.trim());
  return [...new Set(cleaned)];
};

const createUser = async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const skills = req.body.skills === undefined ? [] : sanitizeSkills(req.body.skills);
    if (skills === null) {
      return res.status(400).json({ success: false, message: 'Skills must be an array of strings.' });
    }

    let selectedCareer = null;
    if (req.body.selectedCareer) {
      if (!mongoose.Types.ObjectId.isValid(req.body.selectedCareer)) {
        return res.status(400).json({ success: false, message: 'Invalid selectedCareer ID.' });
      }
      const careerExists = await Career.findById(req.body.selectedCareer);
      if (!careerExists) {
        return res.status(404).json({ success: false, message: 'Selected career not found.' });
      }
      selectedCareer = careerExists._id;
    }

    let user = await User.findOne({ email });
    if (user) {
      user.name = name;
      user.skills = skills;
      if (selectedCareer) user.selectedCareer = selectedCareer;
      if (req.body.password) user.password = req.body.password;
      await user.save();
      return res.status(200).json({ success: true, user: toSafeUser(user) });
    }

    const payload = { name, email, skills, selectedCareer };
    if (req.body.password) payload.password = req.body.password;

    user = await User.create(payload);
    return res.status(201).json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const user = await User.findById(id).populate('selectedCareer', 'title description requiredSkills');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    return res.status(200).json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    if (req.body.name !== undefined) {
      const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
      }
      user.name = name;
    }

    if (req.body.skills !== undefined) {
      const skills = sanitizeSkills(req.body.skills);
      if (skills === null) {
        return res.status(400).json({ success: false, message: 'Skills must be an array of strings.' });
      }
      user.skills = skills;
    }

    if (req.body.selectedCareer !== undefined) {
      if (req.body.selectedCareer === null || req.body.selectedCareer === '') {
        user.selectedCareer = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(req.body.selectedCareer)) {
          return res.status(400).json({ success: false, message: 'Invalid selectedCareer ID.' });
        }
        const careerExists = await Career.findById(req.body.selectedCareer);
        if (!careerExists) {
          return res.status(404).json({ success: false, message: 'Selected career not found.' });
        }
        user.selectedCareer = careerExists._id;
      }
    }

    await user.save();
    return res.status(200).json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
};

const updateUserSkills = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID.' });
    }

    const skills = sanitizeSkills(req.body.skills);
    if (skills === null) {
      return res.status(400).json({ success: false, message: 'Skills must be an array of strings.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    user.skills = skills;
    await user.save();

    return res.status(200).json({ success: true, user: toSafeUser(user) });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createUser, getUser, updateUser, updateUserSkills };
