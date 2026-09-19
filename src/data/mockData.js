// ── Mock Careers ──────────────────────────────────────────────────────────────
export const CAREERS = [
  {
    id: 'swe',
    title: 'Software Engineer',
    category: 'Engineering',
    description: 'Design, develop, and maintain software systems across web, mobile, and backend platforms.',
    salary: '₹12L – ₹20L',
    demand: 'Very High',
    demandLevel: 5,
    skills: ['JavaScript','Python','Data Structures','System Design','Git','SQL','REST APIs','Testing'],
    icon: '',
  },
  {
    id: 'ds',
    title: 'Data Scientist',
    category: 'Data & AI',
    description: 'Extract insights from complex datasets using statistical analysis and machine learning.',
    salary: '₹10L – ₹18L',
    demand: 'High',
    demandLevel: 4,
    skills: ['Python','Statistics','Machine Learning','SQL','Data Visualization','Pandas','NumPy','Communication'],
    icon: '',
  },
  {
    id: 'ux',
    title: 'UX Designer',
    category: 'Design',
    description: 'Create intuitive, accessible user experiences through research, prototyping, and design systems.',
    salary: '₹8L – ₹16L',
    demand: 'High',
    demandLevel: 4,
    skills: ['Figma','User Research','Prototyping','Accessibility','Design Systems','Usability Testing','CSS','Communication'],
    icon: '',
  },
  {
    id: 'pm',
    title: 'Product Manager',
    category: 'Product',
    description: 'Define product vision, prioritize features, and align engineering and business teams.',
    salary: '₹12L – ₹24L',
    demand: 'High',
    demandLevel: 4,
    skills: ['Product Strategy','Roadmapping','Data Analysis','Communication','Agile','User Research','SQL','Stakeholder Management'],
    icon: '',
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    category: 'Engineering',
    description: 'Build and maintain CI/CD pipelines, cloud infrastructure, and deployment automation.',
    salary: '₹10L – ₹20L',
    demand: 'Very High',
    demandLevel: 5,
    skills: ['Linux','Docker','Kubernetes','CI/CD','AWS','Terraform','Python','Monitoring'],
    icon: '',
  },
  {
    id: 'cyber',
    title: 'Cybersecurity Analyst',
    category: 'Security',
    description: 'Protect systems and networks from threats through monitoring, analysis, and incident response.',
    salary: '₹8L – ₹18L',
    demand: 'Very High',
    demandLevel: 5,
    skills: ['Networking','Linux','SIEM','Threat Analysis','Python','Cryptography','Incident Response','Compliance'],
    icon: '',
  },
  {
    id: 'ml',
    title: 'ML Engineer',
    category: 'Data & AI',
    description: 'Build and deploy machine learning models and pipelines at production scale.',
    salary: '₹14L – ₹28L',
    demand: 'Very High',
    demandLevel: 5,
    skills: ['Python','Machine Learning','Deep Learning','MLOps','SQL','Cloud','Statistics','System Design'],
    icon: '',
  },
  {
    id: 'mobile',
    title: 'Mobile Developer',
    category: 'Engineering',
    description: 'Build native and cross-platform mobile applications for iOS and Android.',
    salary: '₹8L – ₹18L',
    demand: 'High',
    demandLevel: 4,
    skills: ['React Native','Swift','Kotlin','REST APIs','UI Design','Git','Testing','Performance Optimization'],
    icon: '',
  },
]

// ── Skill categories ──────────────────────────────────────────────────────────
export const SKILL_CATEGORIES = [
  {
    id: 'programming',
    label: 'Programming',
    skills: ['JavaScript','Python','TypeScript','Java','C++','Go','Rust','Swift','Kotlin'],
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    skills: ['SQL','Data Visualization','Statistics','Machine Learning','Pandas','NumPy','Tableau','Excel'],
  },
  {
    id: 'design',
    label: 'Design & UX',
    skills: ['Figma','User Research','Prototyping','Accessibility','Design Systems','CSS','Usability Testing'],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure & Cloud',
    skills: ['Linux','Docker','Kubernetes','AWS','Terraform','CI/CD','Monitoring','Networking'],
  },
  {
    id: 'soft',
    label: 'Professional Skills',
    skills: ['Communication','Agile','Stakeholder Management','Product Strategy','Roadmapping','Leadership','Problem Solving'],
  },
]

// ── Mock user ─────────────────────────────────────────────────────────────────
export const MOCK_USER = {
  id: 'u1',
  name: 'Priya Sharma',
  email: 'priya@example.com',
  avatar: null,
  education: 'B.Tech Computer Science, 3rd Year',
  college: 'National Institute of Technology',
  interests: ['Web Development', 'Machine Learning', 'Open Source'],
  targetCareerId: 'swe',
  skills: {
    JavaScript:   'proficient',
    Python:       'developing',
    SQL:          'developing',
    Git:          'proficient',
    'REST APIs':  'developing',
    'Data Structures': 'developing',
    Communication: 'proficient',
    Testing:      'beginner',
    'System Design': 'beginner',
    CSS:          'proficient',
    Linux:        'beginner',
    Agile:        'developing',
  },
  joinedAt: '2024-01-15',
  streak: 12,
  totalHours: 47,
}

// ── Roadmap phases ────────────────────────────────────────────────────────────
export const ROADMAP_PHASES = [
  {
    id: 'p1',
    phase: 1,
    title: 'Foundations',
    duration: '4 weeks',
    description: 'Solidify core programming concepts and development environment setup.',
    status: 'completed',
    milestones: [
      { id: 'm1', text: 'Complete JavaScript ES6+ fundamentals', done: true, hours: 8 },
      { id: 'm2', text: 'Build 3 small DOM manipulation projects', done: true, hours: 6 },
      { id: 'm3', text: 'Set up Git workflow and GitHub profile', done: true, hours: 3 },
      { id: 'm4', text: 'Learn async/await and Promises', done: true, hours: 5 },
    ],
    resources: [
      { label: 'JavaScript.info', url: '#' },
      { label: 'The Odin Project', url: '#' },
    ],
  },
  {
    id: 'p2',
    phase: 2,
    title: 'Data Structures & Algorithms',
    duration: '5 weeks',
    description: 'Build problem-solving skills essential for technical interviews.',
    status: 'in-progress',
    milestones: [
      { id: 'm5', text: 'Arrays, strings, and hash maps', done: true, hours: 6 },
      { id: 'm6', text: 'Trees, graphs, and recursion', done: true, hours: 8 },
      { id: 'm7', text: 'Sorting and searching algorithms', done: false, hours: 6 },
      { id: 'm8', text: 'Dynamic programming basics', done: false, hours: 8 },
      { id: 'm9', text: 'Solve 50 LeetCode problems', done: false, hours: 10 },
    ],
    resources: [
      { label: 'NeetCode.io', url: '#' },
      { label: 'Grokking Algorithms', url: '#' },
    ],
  },
  {
    id: 'p3',
    phase: 3,
    title: 'System Design',
    duration: '4 weeks',
    description: 'Learn to design scalable, reliable distributed systems.',
    status: 'upcoming',
    milestones: [
      { id: 'm10', text: 'Understand CAP theorem and consistency models', done: false, hours: 4 },
      { id: 'm11', text: 'Design URL shortener and rate limiter', done: false, hours: 6 },
      { id: 'm12', text: 'Study caching, load balancing, and CDNs', done: false, hours: 5 },
      { id: 'm13', text: 'Design a social media feed system', done: false, hours: 6 },
    ],
    resources: [
      { label: 'System Design Primer', url: '#' },
      { label: 'ByteByteGo', url: '#' },
    ],
  },
  {
    id: 'p4',
    phase: 4,
    title: 'Full-Stack Projects',
    duration: '6 weeks',
    description: 'Build production-quality projects to demonstrate your skills.',
    status: 'upcoming',
    milestones: [
      { id: 'm14', text: 'Build a REST API with Node.js and Express', done: false, hours: 10 },
      { id: 'm15', text: 'Create a React frontend with authentication', done: false, hours: 12 },
      { id: 'm16', text: 'Deploy to cloud with CI/CD pipeline', done: false, hours: 8 },
      { id: 'm17', text: 'Write tests and documentation', done: false, hours: 6 },
    ],
    resources: [
      { label: 'Full Stack Open', url: '#' },
      { label: 'Roadmap.sh', url: '#' },
    ],
  },
]

// ── Weekly activity ───────────────────────────────────────────────────────────
export const WEEKLY_ACTIVITY = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.0 },
  { day: 'Wed', hours: 0.5 },
  { day: 'Thu', hours: 2.5 },
  { day: 'Fri', hours: 1.0 },
  { day: 'Sat', hours: 3.0 },
  { day: 'Sun', hours: 1.5 },
]

// ── Recent activity ───────────────────────────────────────────────────────────
export const RECENT_ACTIVITY = [
  { id: 'a1', type: 'milestone', text: 'Completed "Trees, graphs, and recursion"', time: '2 hours ago', icon: 'check' },
  { id: 'a2', type: 'skill',     text: 'Updated Python skill to Developing',       time: 'Yesterday',   icon: 'zap' },
  { id: 'a3', type: 'career',    text: 'Viewed Software Engineer career details',   time: '2 days ago',  icon: 'briefcase' },
  { id: 'a4', type: 'milestone', text: 'Completed "Arrays, strings, and hash maps"', time: '3 days ago', icon: 'check' },
  { id: 'a5', type: 'assessment',text: 'Completed skill assessment',                time: '1 week ago',  icon: 'clipboard' },
]

// ── Proficiency levels ────────────────────────────────────────────────────────
export const PROFICIENCY_LEVELS = [
  { value: 'none',       label: 'None',       score: 0,   color: 'var(--ink-faint)' },
  { value: 'beginner',   label: 'Beginner',   score: 25,  color: 'var(--terra)' },
  { value: 'developing', label: 'Developing', score: 55,  color: 'var(--gold)' },
  { value: 'proficient', label: 'Proficient', score: 80,  color: 'var(--sage)' },
  { value: 'advanced',   label: 'Advanced',   score: 100, color: 'var(--forest)' },
]

export function getProficiency(value) {
  return PROFICIENCY_LEVELS.find(p => p.value === value) || PROFICIENCY_LEVELS[0]
}

// ── Compute skill match ───────────────────────────────────────────────────────
export function computeSkillMatch(userSkills, career) {
  if (!career) return { score: 0, matched: [], partial: [], missing: [] }
  const matched = [], partial = [], missing = []
  for (const skill of career.skills) {
    const level = userSkills[skill]
    if (!level || level === 'none') missing.push(skill)
    else if (level === 'beginner' || level === 'developing') partial.push(skill)
    else matched.push(skill)
  }
  const score = Math.round(
    ((matched.length * 1 + partial.length * 0.5) / career.skills.length) * 100
  )
  return { score, matched, partial, missing }
}
