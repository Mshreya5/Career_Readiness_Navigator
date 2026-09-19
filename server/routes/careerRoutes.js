const express = require('express');
const router = express.Router();
const {
  getCareers,
  getCareerById,
  getCareerSkills,
  createCareer
} = require('../controllers/careerController');

// GET /api/careers — list all careers (public)
router.get('/', getCareers);

// POST /api/careers — add a career (optional)
router.post('/', createCareer);

// GET /api/careers/:id — single career
router.get('/:id', getCareerById);

// GET /api/careers/:id/skills — required + recommended skills
router.get('/:id/skills', getCareerSkills);

module.exports = router;
