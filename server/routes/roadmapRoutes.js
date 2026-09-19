const express = require('express');
const router = express.Router();
const {
  generateRoadmap,
  getRoadmap,
  updateMilestone,
  getProgress,
  getCareers,
  upsertStudent
} = require('../controllers/roadmapController');

router.post('/generate', generateRoadmap);
router.get('/careers', getCareers);
router.post('/student', upsertStudent);
router.get('/:studentId/:careerId', getRoadmap);
router.patch('/:roadmapId/milestone/:milestoneId', updateMilestone);
router.get('/:roadmapId/progress', getProgress);

module.exports = router;
