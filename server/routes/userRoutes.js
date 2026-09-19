const express = require('express');
const router = express.Router();
const {
  createUser,
  getUser,
  updateUser,
  updateUserSkills
} = require('../controllers/userController');

// POST /api/users — create or get a student
router.post('/', createUser);

// GET /api/users/:id — student profile
router.get('/:id', getUser);

// PATCH /api/users/:id — update profile (name / skills / selectedCareer)
router.patch('/:id', updateUser);

// PATCH /api/users/:id/skills — replace the student's skill set
router.patch('/:id/skills', updateUserSkills);

module.exports = router;
