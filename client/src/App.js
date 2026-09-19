import './index.css';
import { useState } from 'react';
import StudentProfile from './components/StudentProfile';
import CareerSelection from './components/CareerSelection';
import Expedition from './components/Expedition';

const STEPS = ['Profile', 'Career Paths', 'Expedition'];

export default function App() {
  const [step, setStep] = useState(0);
  const [student, setStudent] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [career, setCareer] = useState(null);

  function handleProfileComplete(s) {
    setStudent(s);
    setStep(1);
  }

  function handleCareerComplete(r, c) {
    setRoadmap(r);
    setCareer(c);
    setStep(2);
  }

  function handleRegenerate() {
    setStep(1);
  }

  return (
    <div className="app-container">
      <header className="site-header">
        <h1>CareerNova</h1>
        <span className="tagline">Career Atlas · Field Journal</span>
      </header>

      {/* Step indicator */}
      <div className="step-indicator">
        {STEPS.map((s, i) => (
          <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`step-item${i === step ? ' active' : i < step ? ' done' : ''}`}>
              {String(i + 1).padStart(2, '0')} {s}
            </span>
            {i < STEPS.length - 1 && <span className="step-sep">→</span>}
          </span>
        ))}
      </div>

      {step === 0 && <StudentProfile onComplete={handleProfileComplete} />}
      {step === 1 && student && (
        <CareerSelection
          student={student}
          onComplete={handleCareerComplete}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && roadmap && student && (
        <Expedition
          roadmap={roadmap}
          student={student}
          career={career}
          onBack={() => setStep(1)}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}
