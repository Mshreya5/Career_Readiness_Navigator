import { Link } from 'react-router-dom'
import { Compass, ArrowRight, Search, BarChart2, Map, CheckCircle, TrendingUp } from 'lucide-react'
import { CAREERS } from '../data/mockData.js'
import styles from './Landing.module.css'

const STEPS = [
  { icon: <Search size={20} />, label: 'Discover', desc: 'Explore careers that match your interests and goals.' },
  { icon: <CheckCircle size={20} />, label: 'Assess', desc: 'Rate your current skills across key competency areas.' },
  { icon: <TrendingUp size={20} />, label: 'Identify Gaps', desc: 'See exactly where you stand vs. what employers need.' },
  { icon: <Map size={20} />, label: 'Build Roadmap', desc: 'Get a personalized, phase-by-phase learning plan.' },
  { icon: <BarChart2 size={20} />, label: 'Track Progress', desc: 'Log milestones and watch your readiness grow.' },
]

export default function Landing() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <Compass size={20} strokeWidth={1.8} />
          <span>CareerNav</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Career readiness for students</p>
          <h1 className={styles.heroHeadline}>
            Your career path<br />starts with <em>clarity.</em>
          </h1>
          <p className={styles.heroSub}>
            CareerNav helps you discover the right career, assess your skills honestly,
            close the gaps that matter, and build a roadmap that actually gets you there.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Explore Your Path <ArrowRight size={17} />
            </Link>
            <Link to="/careers" className="btn btn-secondary btn-lg">View Careers</Link>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardLabel}>Skill Match</div>
            <div className={styles.heroCardScore}>72%</div>
            <div className={styles.heroCardBar}>
              <div className={styles.heroCardFill} style={{ width: '72%' }} />
            </div>
            <div className={styles.heroCardCareer}>Software Engineer</div>
          </div>
          <div className={`${styles.heroCard} ${styles.heroCardSm}`}>
            <div className={styles.heroCardLabel}>Next milestone</div>
            <div className={styles.heroCardMilestone}>Sorting &amp; searching algorithms</div>
            <div className={styles.heroCardPhase}>Phase 2 · Week 3</div>
          </div>
        </div>
      </section>

      {/* Journey steps */}
      <section className={styles.steps}>
        <div className={styles.stepsInner}>
          <p className={styles.sectionEyebrow}>How it works</p>
          <h2 className={styles.sectionTitle}>Five steps to career clarity</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((s, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div className={styles.stepIcon}>{s.icon}</div>
                <h4 className={styles.stepLabel}>{s.label}</h4>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured careers */}
      <section className={styles.featured}>
        <div className={styles.featuredInner}>
          <p className={styles.sectionEyebrow}>Explore paths</p>
          <h2 className={styles.sectionTitle}>In-demand careers</h2>
          <div className={styles.careerGrid}>
            {CAREERS.slice(0, 4).map(c => (
              <div key={c.id} className={styles.careerTile}>
                <span className={styles.careerIcon}>{c.icon}</span>
                <div>
                  <h4 className={styles.careerTitle}>{c.title}</h4>
                  <p className={styles.careerSalary}>{c.salary}</p>
                </div>
                <span className={`badge badge-forest ${styles.demandBadge}`}>{c.demand}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/signup" className="btn btn-primary">
              Start your journey <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          <Compass size={16} strokeWidth={1.8} />
          <span>CareerNav</span>
        </div>
        <p className={styles.footerTagline}>Navigate your skills. Build your future.</p>
        <div className={styles.footerLinks}>
          <Link to="/login">Sign in</Link>
          <Link to="/signup">Get started</Link>
          <Link to="/careers">Careers</Link>
        </div>
        <p className={styles.footerCopy}>© 2024 CareerNav. Built for students.</p>
      </footer>
    </div>
  )
}
