const { normalizeSkill } = require('./skillMatchingService');

const PREREQUISITES_MAP = {
  'javascript': ['react', 'node.js', 'express', 'vue', 'angular', 'typescript', 'next.js'],
  'html': ['css', 'javascript', 'react', 'vue'],
  'css': ['tailwind', 'bootstrap', 'sass'],
  'python': ['django', 'flask', 'fastapi', 'pandas', 'numpy', 'machine learning'],
  'java': ['spring', 'spring boot', 'android'],
  'sql': ['postgresql', 'mysql', 'database']
};

const CORE_HIGH_SKILLS = new Set([
  'javascript', 'python', 'java', 'html', 'css', 'react', 'typescript', 'c++'
]);

function calculateSkillPriorities(missingSkills = [], careerTitle = '', matchedSkills = []) {
  const normalizedMissing = missingSkills.map(s => normalizeSkill(s));

  return missingSkills.map(skill => {
    const normSkill = normalizeSkill(skill);

    const dependentSkills = PREREQUISITES_MAP[normSkill] || [];
    const hasMissingDependents = dependentSkills.some(dep => normalizedMissing.includes(dep));

    if (hasMissingDependents) {
      return { skill, priority: 'High' };
    }

    if (CORE_HIGH_SKILLS.has(normSkill)) {
      return { skill, priority: 'High' };
    }

    if (['node.js', 'mongodb', 'express', 'sql', 'postgresql', 'docker', 'git'].includes(normSkill)) {
      return { skill, priority: 'Medium' };
    }

    return { skill, priority: 'Low' };
  });
}

module.exports = {
  calculateSkillPriorities
};
