const express = require('express');
const router = express.Router();
const { getSkillGap, getRecommendations } = require('../controllers/analysisController');

// POST /api/analysis/skill-gap
router.post('/skill-gap', getSkillGap);

// POST /api/analysis/recommendations
router.post('/recommendations', getRecommendations);

module.exports = router;
