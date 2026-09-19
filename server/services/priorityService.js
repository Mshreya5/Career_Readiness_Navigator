/**
 * Priority Service
 * Assigns explainable priorities (High, Medium, Low) to missing skills
 * based on prerequisites, foundational importance, and dependencies.
 */

const { normalizeSkill } = require('./skillMatchingService');

// Prerequisite map: skill -> skills that depend on it
const PREREQUISITES_MAP = {
  'javascript': ['react', 'node.js', 'express', 'vue', 'angular', 'typescript', 'next.js'],
  'html': ['css', 'javascript', 'react', 'vue'],
  'css': ['tailwind', 'bootstrap', 'sass'],
  'python': ['django', 'flask', 'fastapi', 'pandas', 'numpy', 'machine learning'],
  'java': ['spring', 'spring boot', 'android'],
  'sql': ['postgresql', 'mysql', 'database']
};

// Core foundational skills default to High priority
const CORE_HIGH_SKILLS = new Set([
  'javascript', 'python', 'java', 'html', 'css', 'react', 'typescript', 'c++'
]);

/**
 * Calculates priorities for missing skills
 * @param {Array<string>} missingSkills
 * @param {string} careerTitle
 * @param {Array<string>} matchedSkills
 * @returns {Array<Object>} [{ skill: 'JavaScript', priority: 'High' }, ...]
 */
function calculateSkillPriorities(missingSkills = [], careerTitle = '', matchedSkills = []) {
  const normalizedMissing = missingSkills.map(s => normalizeSkill(s));

  return missingSkills.map(skill => {
    const normSkill = normalizeSkill(skill);

    // Rule 1: Check if another missing skill depends on this skill
    const dependentSkills = PREREQUISITES_MAP[normSkill] || [];
    const hasMissingDependents = dependentSkills.some(dep => normalizedMissing.includes(dep));

    if (hasMissingDependents) {
      return { skill, priority: 'High' };
    }

    // Rule 2: Check if skill is a foundational language or framework
    if (CORE_HIGH_SKILLS.has(normSkill)) {
      return { skill, priority: 'High' };
    }

    // Rule 3: Middle tier backend, database, or tool dependencies
    if (['node.js', 'mongodb', 'express', 'sql', 'postgresql', 'docker', 'git'].includes(normSkill)) {
      return { skill, priority: 'Medium' };
    }

    // Rule 4: Default Low priority for specialized / elective skills
    return { skill, priority: 'Low' };
  });
}

module.exports = {
  calculateSkillPriorities
};
