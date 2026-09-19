const mongoose = require('mongoose');
const Career = require('../models/Career');

const getCareers = async (req, res, next) => {
  try {
    let careers = await Career.find({}, 'title description requiredSkills recommendedSkills');
    if (!careers || careers.length === 0) {
      await Career.insertMany([
        {
          title: 'Full Stack Developer',
          description: 'Develops full-stack web applications across frontend, backend and databases.',
          requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS', 'Git', 'SQL'],
          recommendedSkills: ['Docker', 'Next.js', 'REST APIs', 'System Design']
        },
        {
          title: 'Data Scientist',
          description: 'Analyzes complex datasets, extracts insights, and builds machine learning models.',
          requiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistics', 'Machine Learning', 'Data Visualization'],
          recommendedSkills: ['TensorFlow', 'PyTorch', 'Tableau', 'Big Data']
        },
        {
          title: 'Frontend Developer',
          description: 'Engineers high-performance, responsive user interfaces and web applications.',
          requiredSkills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind', 'Git'],
          recommendedSkills: ['Figma', 'Next.js', 'Web Performance', 'Redux']
        },
        {
          title: 'Backend Developer',
          description: 'Architects and maintains secure server-side logic, databases, microservices and APIs.',
          requiredSkills: ['JavaScript', 'Node.js', 'Express', 'Python', 'SQL', 'MongoDB', 'Git'],
          recommendedSkills: ['Docker', 'PostgreSQL', 'Redis', 'GraphQL', 'Microservices']
        },
        {
          title: 'DevOps Engineer',
          description: 'Automates deployment pipelines, cloud infrastructure, monitoring and security.',
          requiredSkills: ['Linux', 'Docker', 'Git', 'Python', 'Bash', 'CI/CD', 'SQL'],
          recommendedSkills: ['Kubernetes', 'Terraform', 'AWS', 'Monitoring']
        }
      ]);
      careers = await Career.find({}, 'title description requiredSkills recommendedSkills');
    }
    return res.status(200).json(careers);
  } catch (error) {
    return next(error);
  }
};

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
