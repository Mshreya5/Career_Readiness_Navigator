const RESOURCES = {
  'javascript': 'MDN Web Docs / freeCodeCamp',
  'react': 'React Documentation (react.dev) / freeCodeCamp',
  'node.js': 'Node.js Documentation / Express Documentation',
  'mongodb': 'MongoDB University / MongoDB Documentation',
  'html': 'MDN Web Docs / freeCodeCamp',
  'css': 'MDN Web Docs / CSS-Tricks',
  'python': 'Python Documentation / freeCodeCamp',
  'typescript': 'TypeScript Documentation / Total TypeScript',
  'express': 'Express Documentation',
  'sql': 'SQLZoo / W3Schools SQL',
  'git': 'Pro Git Book / GitHub Docs',
  'docker': 'Docker Documentation / Play with Docker',
  'java': 'Oracle Java Docs / Codecademy',
  'django': 'Django Documentation',
  'flask': 'Flask Documentation',
  'vue': 'Vue.js Documentation',
  'angular': 'Angular Documentation',
  'postgresql': 'PostgreSQL Documentation',
  'mysql': 'MySQL Documentation'
};

const DESCRIPTIONS = {
  'javascript': 'Build strong JavaScript fundamentals required for modern web development.',
  'react': 'Learn React to build interactive, component-based user interfaces.',
  'node.js': 'Master server-side JavaScript with Node.js for backend development.',
  'mongodb': 'Learn NoSQL database design and operations with MongoDB.',
  'html': 'Master the structure and semantics of web pages with HTML.',
  'css': 'Style web pages with CSS layouts, flexbox, and responsive design.',
  'python': 'Learn Python fundamentals for scripting, automation, and data work.',
  'typescript': 'Add static typing to JavaScript for safer, scalable codebases.',
  'express': 'Build REST APIs and web servers using the Express.js framework.',
  'git': 'Learn version control and collaborative development workflows with Git.',
  'docker': 'Containerize applications for consistent deployment environments.',
  'sql': 'Learn relational database querying and schema design with SQL.'
};

function getResource(skill) {
  const key = skill.toLowerCase().replace(/\s+/g, '').replace('.', '');
  for (const [k, v] of Object.entries(RESOURCES)) {
    if (k.replace('.', '').replace(/\s+/g, '') === key) return v;
  }
  return `${skill} Official Documentation`;
}

function getDescription(skill) {
  const key = skill.toLowerCase();
  return DESCRIPTIONS[key] || `Develop proficiency in ${skill} to meet career requirements.`;
}

function buildMilestones(skillGapData, recommendationData) {
  const { missingSkills = [], priorities = [] } = skillGapData;
  const { recommendations = [], learningOrder = [] } = recommendationData || {};

  const recMap = {};
  recommendations.forEach(r => { recMap[r.skill] = r; });

  const priorityMap = {};
  priorities.forEach(p => { priorityMap[p.skill] = p.priority; });

  let orderedSkills = [];
  if (learningOrder.length > 0) {
    orderedSkills = [...learningOrder];
    missingSkills.forEach(s => {
      if (!orderedSkills.includes(s)) orderedSkills.push(s);
    });
  } else {
    const priorityRank = { High: 1, Medium: 2, Low: 3 };
    orderedSkills = [...missingSkills].sort((a, b) => {
      const pa = priorityRank[priorityMap[a]] || 4;
      const pb = priorityRank[priorityMap[b]] || 4;
      return pa - pb;
    });
  }

  return orderedSkills.map((skill, idx) => {
    const rec = recMap[skill] || {};
    return {
      order: idx + 1,
      skill,
      priority: rec.priority || priorityMap[skill] || 'Medium',
      description: rec.reason ? rec.reason : getDescription(skill),
      nextStep: rec.nextStep || `Start learning ${skill} through official documentation.`,
      resource: getResource(skill),
      status: 'Not Started'
    };
  });
}

module.exports = { buildMilestones };
