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

const PARTIAL_SKILL_RELATIONS = {
  'express': 'node.js',
  'react native': 'react',
  'postgresql': 'mongodb',
  'mysql': 'mongodb',
  'c++': 'c'
};

function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const cleaned = skill.trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}

function calculateSkillGap(studentSkills = [], careerRequiredSkills = [], assessments = []) {
  const normalizedStudentMap = new Map();
  studentSkills.forEach(s => {
    if (s && typeof s === 'string') {
      const norm = normalizeSkill(s);
      normalizedStudentMap.set(norm, s.trim());
    }
  });

  const assessmentMap = new Map();
  if (Array.isArray(assessments)) {
    assessments.forEach(a => {
      if (a && a.skill) {
        const norm = normalizeSkill(a.skill);
        assessmentMap.set(norm, a);
      }
    });
  }

  const matchedSkills = [];
  const missingSkills = [];
  const partialSkills = [];
  const assessmentExplanations = [];

  const matchedStudentNorms = new Set();

  careerRequiredSkills.forEach(reqSkill => {
    if (!reqSkill || typeof reqSkill !== 'string') return;
    const reqTrimmed = reqSkill.trim();
    const reqNorm = normalizeSkill(reqTrimmed);
    const hasAssessed = assessmentMap.get(reqNorm);

    if (normalizedStudentMap.has(reqNorm)) {
      if (hasAssessed && hasAssessed.percentage < 70) {
        partialSkills.push(reqTrimmed);
        assessmentExplanations.push({
          skill: reqTrimmed,
          status: 'PARTIAL',
          percentage: hasAssessed.percentage,
          skillLevel: hasAssessed.skillLevel,
          message: `Your profile says you know ${reqTrimmed}, but your assessment indicates that you need more practice.`
        });
      } else {
        matchedSkills.push(reqTrimmed);
        matchedStudentNorms.add(reqNorm);
        if (hasAssessed) {
          assessmentExplanations.push({
            skill: reqTrimmed,
            status: 'MATCHED',
            percentage: hasAssessed.percentage,
            skillLevel: hasAssessed.skillLevel,
            message: `Assessment verified: ${reqTrimmed} (${hasAssessed.percentage}%, ${hasAssessed.skillLevel}).`
          });
        }
      }
    } else {
      if (hasAssessed && hasAssessed.percentage >= 70) {
        matchedSkills.push(reqTrimmed);
        assessmentExplanations.push({
          skill: reqTrimmed,
          status: 'DETECTED SKILL',
          percentage: hasAssessed.percentage,
          skillLevel: hasAssessed.skillLevel,
          message: `Detected skill from assessment: ${reqTrimmed} (${hasAssessed.percentage}%).`
        });
      } else {
        missingSkills.push(reqTrimmed);
      }
    }
  });

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
    matchPercentage,
    assessmentExplanations
  };
}

module.exports = {
  normalizeSkill,
  calculateSkillGap
};
