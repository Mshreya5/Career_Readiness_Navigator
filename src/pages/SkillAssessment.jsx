import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { mockAssessmentQuestions } from '../data/mockData.js'
import './SkillAssessment.css'

export default function SkillAssessment() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  const q = mockAssessmentQuestions[current]
  const total = mockAssessmentQuestions.length
  const score = Object.entries(answers).filter(([i, a]) => mockAssessmentQuestions[i].answer === a).length

  function handleAnswer(optionIdx) {
    setAnswers(a => ({ ...a, [current]: optionIdx }))
  }

  function handleNext() {
    if (current < total - 1) setCurrent(c => c + 1)
    else setFinished(true)
  }

  if (finished) {
    return (
      <Layout>
        <div className="page-header"><h1>Assessment Complete!</h1></div>
        <div className="card assessment-result">
          <div className="result-score">{score}/{total}</div>
          <p>You answered {score} out of {total} questions correctly.</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Your skill levels have been updated based on your responses.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/skill-gap')}>View Skill Gap</button>
            <button className="btn btn-outline" onClick={() => { setCurrent(0); setAnswers({}); setFinished(false) }}>Retake</button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Skill Assessment</h1>
        <p>Question {current + 1} of {total}</p>
      </div>

      <div className="assessment-progress">
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="card assessment-card">
        <span className="badge badge-primary">{q.skill}</span>
        <h3 className="question-text">{q.question}</h3>
        <div className="options-list">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn${answers[current] === i ? ' selected' : ''}`}
              onClick={() => handleAnswer(i)}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={answers[current] === undefined}
          style={{ marginTop: '1.5rem' }}
        >
          {current < total - 1 ? 'Next Question' : 'Finish Assessment'}
        </button>
      </div>
    </Layout>
  )
}
