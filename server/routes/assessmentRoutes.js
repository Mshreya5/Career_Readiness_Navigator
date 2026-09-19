const express = require('express')
const router = express.Router()
const {
  startAssessment,
  getQuestions,
  submitAssessment,
  getAssessmentResult,
  getAssessmentHistory,
  getCodingProblem,
  runCoding,
  submitCoding
} = require('../controllers/assessmentController')

router.post('/start', startAssessment)
router.get('/questions/:skill', getQuestions)
router.get('/result/:id', getAssessmentResult)
router.get('/history/:studentId', getAssessmentHistory)

router.get('/coding/problem/:skill', getCodingProblem)
router.post('/coding/run', runCoding)
router.post('/coding/submit', submitCoding)

router.get('/problem/:skill', getCodingProblem)
router.post('/run', runCoding)

router.post('/submit', (req, res, next) => {
  if (req.body && (req.body.code || req.body.problemId || req.body.language)) {
    return submitCoding(req, res, next)
  }
  return submitAssessment(req, res, next)
})

module.exports = router
