import { useMemo, useState } from 'react'
import { BookOpen, CheckCircle, ExternalLink, Flame, Gamepad2, PlayCircle, Sparkles, Target } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout.jsx'
import { useApp } from '../context/AppContext.jsx'
import { CAREERS } from '../data/mockData.js'
import { COURSE_PLANS, RESOURCE_LIBRARY } from '../data/tutorData.js'
import styles from './Tutor.module.css'

const CHALLENGES = [
  'Explain a concept you learned today in three sentences.',
  'Build a tiny version of today’s topic before opening another tutorial.',
  'Teach the topic to an imaginary teammate using one real-world analogy.',
]

const COURSE_OPTIONS = [
  ...CAREERS.map(career => ({ id: career.id, title: career.title })),
  { id: 'system-design', title: 'System Design' },
]

export default function Tutor() {
  const { targetCareer, tutorProgress, toggleTutorTask } = useApp()
  const [challengeDone, setChallengeDone] = useState(false)
  const [selectedCareerId, setSelectedCareerId] = useState(targetCareer?.id || 'swe')
  const [selectedTopicName, setSelectedTopicName] = useState(null)
  const selectedCourse = COURSE_OPTIONS.find(course => course.id === selectedCareerId) || COURSE_OPTIONS[0]
  const plan = COURSE_PLANS[selectedCourse.id] || COURSE_PLANS.swe
  const allTopics = plan.modules.flatMap(courseModule => courseModule.topics.map(topic => ({ ...courseModule, topic })))
  const completed = allTopics.filter(item => tutorProgress[`${selectedCourse.id}:${item.topic}`]).length
  const nextTopic = allTopics.find(item => !tutorProgress[`${selectedCourse.id}:${item.topic}`]) || allTopics[0]
  const selectedTopic = allTopics.find(item => item.topic === selectedTopicName) || nextTopic
  const selectedResources = RESOURCE_LIBRARY[selectedTopic.topic]
  const challenge = useMemo(() => CHALLENGES[completed % CHALLENGES.length], [completed])
  const xp = completed * 40 + (challengeDone ? 60 : 0)
  const percent = Math.round((completed / allTopics.length) * 100)

  if (!targetCareer) return null

  return (
    <AppLayout>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}><Sparkles size={14} /> Your personal tutor</p>
            <h1 className={styles.title}>Personal Tutor</h1>
            <p className={styles.sub}>{plan.subtitle}</p>
          </div>
          <div className={styles.xpCard}>
            <div className={styles.xpIcon}><Flame size={18} /></div>
            <div><strong>{xp} XP</strong><span>{completed ? 'Keep your momentum' : 'Start your first lesson'}</span></div>
          </div>
        </section>

        <section className={`card ${styles.coursePicker}`}>
          <div className={styles.pickerHeading}>
            <div><p className={styles.eyebrow}>Step 1</p><h2>Choose your course</h2></div>
            <span>Pick a path to begin learning</span>
          </div>
          <div className={styles.courseOptions}>
            {COURSE_OPTIONS.map(courseOption => {
              const course = COURSE_PLANS[courseOption.id]
              return (
                <button
                  key={courseOption.id}
                  className={`${styles.courseOption} ${selectedCourse.id === courseOption.id ? styles.courseOptionActive : ''}`}
                  onClick={() => { setSelectedCareerId(courseOption.id); setSelectedTopicName(null); setChallengeDone(false) }}
                  aria-pressed={selectedCourse.id === courseOption.id}
                >
                  <strong>{courseOption.title}</strong>
                  <span>{course.modules.reduce((count, courseModule) => count + courseModule.topics.length, 0)} topics</span>
                </button>
              )
            })}
          </div>
        </section>

        <div className={styles.progressPanel}>
          <div className={styles.progressCopy}><span>Course progress</span><strong>{percent}%</strong></div>
          <div className={styles.track}><span style={{ width: `${percent}%` }} /></div>
          <p>{completed} of {allTopics.length} topics completed · Your tutor keeps your place automatically.</p>
        </div>

        <div className={styles.focusGrid}>
          <section className={`card ${styles.nextCard}`}>
            <div className={styles.sectionKicker}><Target size={15} /> Step 2 · Choose a topic</div>
            <h2>{selectedTopic.topic}</h2>
            <p>From <strong>{selectedTopic.title}</strong> · open the lesson or guide when you are ready.</p>
            <div className={styles.resourceColumns}>
              <div><h3><PlayCircle size={14} /> YouTube lessons</h3>{selectedResources.youtube.map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer">{resource.label}<ExternalLink size={12} /></a>)}</div>
              <div><h3><BookOpen size={14} /> Course websites</h3>{selectedResources.sites.map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer">{resource.label}<ExternalLink size={12} /></a>)}</div>
            </div>
          </section>

          <section className={`card ${styles.challengeCard}`}>
            <div className={styles.sectionKicker}><Gamepad2 size={15} /> Tutor challenge</div>
            <h2>Make it stick.</h2>
              <p>{challenge}</p>
            <button className={`btn btn-ghost btn-sm ${challengeDone ? styles.doneButton : ''}`} onClick={() => setChallengeDone(done => !done)}>
              {challengeDone ? <><CheckCircle size={15} /> Challenge complete</> : 'Mark challenge complete'}
            </button>
          </section>
        </div>

        <section className={styles.planSection}>
          <div className={styles.planHeading}><div><p className={styles.eyebrow}>The full route</p><h2>Course planner</h2></div><span className={styles.topicCount}>{allTopics.length} topics</span></div>
          <div className={styles.modules}>
            {plan.modules.map((courseModule, index) => (
              <article key={courseModule.id} className={`card ${styles.module}`}>
                <div className={styles.moduleHeader}><span className={styles.moduleNumber}>0{index + 1}</span><div><h3>{courseModule.title}</h3><span>{courseModule.duration}</span></div></div>
                <div className={styles.topicList}>
                  {courseModule.topics.map(topic => {
                    const key = `${selectedCourse.id}:${topic}`
                    const done = !!tutorProgress[key]
                    const resource = RESOURCE_LIBRARY[topic]
                    return (
                      <div key={topic} className={`${styles.topic} ${done ? styles.topicDone : ''}`}>
                        <button className={styles.topicCheck} onClick={() => toggleTutorTask(key)} aria-label={`${done ? 'Mark' : 'Complete'} ${topic}`}>
                          {done ? <CheckCircle size={17} /> : <span />}
                        </button>
                        <button className={`${styles.topicName} ${selectedTopic.topic === topic ? styles.topicSelected : ''}`} onClick={() => setSelectedTopicName(topic)}>{topic}</button>
                        <div className={styles.topicLinks}>
                          <button onClick={() => setSelectedTopicName(topic)} aria-label={`Choose ${topic}`}>Choose</button>
                          <a href={resource?.youtube} target="_blank" rel="noreferrer" aria-label={`Open ${topic} YouTube course`}><PlayCircle size={15} /></a>
                          <a href={resource?.site} target="_blank" rel="noreferrer" aria-label={`Open ${topic} course website`}><ExternalLink size={15} /></a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}