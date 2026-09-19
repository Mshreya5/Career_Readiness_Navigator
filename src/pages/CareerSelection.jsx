import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Layout from '../components/Layout.jsx'
import { mockCareers } from '../data/mockData.js'
import './CareerSelection.css'

export default function CareerSelection() {
  const navigate = useNavigate()
  const stored = JSON.parse(localStorage.getItem('user') || '{}')
  const [selected, setSelected] = useState(stored.selectedCareer || null)

  function handleSelect(career) {
    setSelected(career.title)
    const updated = { ...stored, selectedCareer: career.title }
    localStorage.setItem('user', JSON.stringify(updated))
  }

  function handleContinue() {
    if (selected) navigate('/skill-assessment')
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Choose Your Career Path</h1>
        <p>Select the career you want to pursue. You can change this later.</p>
      </div>

      <div className="career-grid">
        {mockCareers.map(career => (
          <div
            key={career.id}
            className={`card career-card${selected === career.title ? ' selected' : ''}`}
            onClick={() => handleSelect(career)}
          >
            {selected === career.title && <CheckCircle className="career-check" size={20} />}
            <div className="career-icon">{career.icon}</div>
            <h3>{career.title}</h3>
            <p>{career.description}</p>
            <div className="career-demand">
              <span className="badge badge-primary">Demand: {career.demand}</span>
            </div>
            <div className="career-skills">
              {career.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="career-action">
          <p>Selected: <strong>{selected}</strong></p>
          <button className="btn btn-primary" onClick={handleContinue}>Continue to Skill Assessment</button>
        </div>
      )}
    </Layout>
  )
}
