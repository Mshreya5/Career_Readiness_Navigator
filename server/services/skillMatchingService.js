/**
 * Skill Matching Service
 * Provides skill normalization, alias resolution, deterministic matching, 
 * gap analysis, and match percentage calculations.
 */

// Common alias map: maps variations to canonical lowercased representation
const SKILL_ALIASES = {
  'js': 'javascript',
  'java script': 'javascript',
  'node': 'node.js',
  'node js': 'node.js',
  'nodejs': 'node.js',
  'react js': 'react',
  'reactjs': 'react',
  'mongo': 'mongodb',
  'mongo db': 'mongodb',
  'html5': 'html',
  'css3': 'css',
  'py': 'python',
  'express js': 'express',
  'expressjs': 'express',
  'ts': 'typescript',
  'type script': 'typescript'
};

// Map of student skills that partially satisfy a required skill requirement
const PARTIAL_SKILL_RELATIONS = {
  'express': 'node.js',
  'react native': 'react',
  'postgresql': 'mongodb',
  'mysql': 'mongodb',
  'c++': 'c'
};

/**
 * Normalizes skill string: lowercase, trim whitespace, and resolve aliases
 * @param {string} skill
 * @returns {string}
 */
function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const cleaned = skill.trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}

/**
 * Perform skill gap analysis between student skills and career required skills
 * @param {Array<string>} studentSkills
 * @param {Array<string>} careerRequiredSkills
 * @returns {Object} { matchedSkills, missingSkills, partialSkills, matchPercentage }
 */
function calculateSkillGap(studentSkills = [], careerRequiredSkills = []) {
  const normalizedStudentMap = new Map();
  studentSkills.forEach(s => {
    if (s && typeof s === 'string') {
      const norm = normalizeSkill(s);
      normalizedStudentMap.set(norm, s.trim());
    }
  });

  const matchedSkills = [];
  const missingSkills = [];
  const partialSkills = [];

  const matchedStudentNorms = new Set();

  careerRequiredSkills.forEach(reqSkill => {
    if (!reqSkill || typeof reqSkill !== 'string') return;
    const reqTrimmed = reqSkill.trim();
    const reqNorm = normalizeSkill(reqTrimmed);

    if (normalizedStudentMap.has(reqNorm)) {
      matchedSkills.push(reqTrimmed);
      matchedStudentNorms.add(reqNorm);
    } else {
      missingSkills.push(reqTrimmed);
    }
  });

  // Identify partial skills from unmatched student skills
  normalizedStudentMap.forEach((originalStudentSkill, studentNorm) => {
    if (!matchedStudentNorms.has(studentNorm)) {
      careerRequiredSkills.forEach(reqSkill => {
        const reqNorm = normalizeSkill(reqSkill);
        if (PARTIAL_SKILL_RELATIONS[studentNorm] === reqNorm) {
          if (!partialSkills.includes(originalStudentSkill)) {
            partialSkills.push(originalStudentSkill);
          }
        }
      });
    }
  });

  const totalRequired = careerRequiredSkills.length;
  const matchPercentage = totalRequired > 0
    ? Math.round((matchedSkills.length / totalRequired) * 100)
    : 0;

  return {
    matchedSkills,
    missingSkills,
    partialSkills,
    matchPercentage
  };
}

module.exports = {
  normalizeSkill,
  calculateSkillGap
};
