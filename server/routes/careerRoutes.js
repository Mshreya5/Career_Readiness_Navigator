const express = require('express');
const router = express.Router();
const {
  getCareers,
  getCareerById,
  getCareerSkills,
  createCareer
} = require('../controllers/careerController');

router.get('/', getCareers);
router.post('/', createCareer);
router.get('/:id', getCareerById);
router.get('/:id/skills', getCareerSkills);

module.exports = router;
