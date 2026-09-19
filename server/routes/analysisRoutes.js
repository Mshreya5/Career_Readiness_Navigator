const express = require('express');
const router = express.Router();
const { getSkillGap, getRecommendations } = require('../controllers/analysisController');

router.post('/skill-gap', getSkillGap);
router.post('/recommendations', getRecommendations);

module.exports = router;
