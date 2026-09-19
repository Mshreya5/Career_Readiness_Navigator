const { normalizeSkill, calculateSkillGap } = require('./services/skillMatchingService');
const { calculateSkillPriorities } = require('./services/priorityService');
const { generateRecommendations, generateFallbackRecommendations } = require('./services/aiRecommendationService');

console.log('=== RUNNING MEMBER 3 UNIT TESTS ===\n');

// Test 1: Normalization
console.log('Test 1: Skill Normalization');
console.log('  "Java Script" ->', normalizeSkill('Java Script'));
console.log('  "Node JS"     ->', normalizeSkill('Node JS'));
console.log('  " HTML5 "     ->', normalizeSkill(' HTML5 '));
console.assert(normalizeSkill('Java Script') === 'javascript', 'Failed JS normalization');
console.assert(normalizeSkill('Node JS') === 'node.js', 'Failed Node JS normalization');

// Test 2: Skill Gap Calculation
console.log('\nTest 2: Skill Gap Calculation');
const studentSkills = ['Java', 'Python', 'HTML'];
const careerRequired = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML'];

const gap = calculateSkillGap(studentSkills, careerRequired);
console.log('Gap Output:', JSON.stringify(gap, null, 2));

console.assert(gap.matchedSkills.length === 1 && gap.matchedSkills[0] === 'HTML', 'Matched skills mismatch');
console.assert(gap.missingSkills.length === 4, 'Missing skills length mismatch');
console.assert(gap.matchPercentage === 20, `Expected 20% match percentage, got ${gap.matchPercentage}%`);

// Test 3: Priority Engine
console.log('\nTest 3: Priority Calculation');
const priorities = calculateSkillPriorities(gap.missingSkills, 'Full Stack Developer', gap.matchedSkills);
console.log('Priorities Output:', JSON.stringify(priorities, null, 2));

const jsPriority = priorities.find(p => p.skill === 'JavaScript')?.priority;
const reactPriority = priorities.find(p => p.skill === 'React')?.priority;
console.assert(jsPriority === 'High', `Expected High for JS, got ${jsPriority}`);
console.assert(reactPriority === 'High', `Expected High for React, got ${reactPriority}`);

// Test 4: Recommendation Generator (Fallback)
console.log('\nTest 4: Recommendation Service (Offline Fallback)');
const recs = generateFallbackRecommendations({
  career: 'Full Stack Developer',
  matchedSkills: gap.matchedSkills,
  missingSkills: gap.missingSkills,
  partialSkills: gap.partialSkills,
  priorities
});
console.log('Recommendations Output:', JSON.stringify(recs, null, 2));

console.assert(recs.summary && recs.recommendations.length > 0 && recs.learningOrder.length > 0, 'Invalid recommendations structure');

console.log('\n=== ALL UNIT TESTS PASSED SUCCESSFULLY! ===');
