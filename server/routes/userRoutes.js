const express = require('express');
const router = express.Router();
const {
  createUser,
  getUser,
  updateUser,
  updateUserSkills
} = require('../controllers/userController');

router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.patch('/:id/skills', updateUserSkills);

module.exports = router;
