/**
 * AI Recommendation Service
 * Uses Google Gemini API (@google/generative-ai) to generate personalized learning explanations, 
 * recommendations, reasons, and next steps based on deterministic skill gap analysis.
 * Includes a deterministic offline fallback when AI API key is missing or call fails.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Deterministic fallback generator (works 100% offline without AI API key)
 */
function generateFallbackRecommendations({ career = '', matchedSkills = [], missingSkills = [], partialSkills = [], priorities = [] }) {
  const priorityRank = { 'High': 1, 'Medium': 2, 'Low': 3 };
  const sortedPriorities = [...priorities].sort((a, b) =>
    (priorityRank[a.priority] || 4) - (priorityRank[b.priority] || 4)
  );

  const learningOrder = sortedPriorities.map(p => p.skill);

  const defaultReasons = {
    'JavaScript': 'Core prerequisite language essential for client-side and server-side web development.',
    'React': 'Industry standard frontend UI library built on JavaScript fundamentals.',
    'Node.js': 'Popular JavaScript runtime environment required for backend service development.',
    'MongoDB': 'NoSQL document database widely integrated with Node.js applications.'
  };

  const defaultNextSteps = {
    'JavaScript': 'Master ES6+ syntax, Async/Await, array methods, and asynchronous concepts on FreeCodeCamp or MDN.',
    'React': 'Build interactive single-page UI components utilizing Hooks (useState, useEffect) and Props.',
    'Node.js': 'Develop modular REST APIs using Express.js middleware and asynchronous route handlers.',
    'MongoDB': 'Learn Mongoose schema creation, database connection, and CRUD query operations.'
  };

  const recommendations = sortedPriorities.map(({ skill, priority }) => ({
    skill,
    priority,
    reason: defaultReasons[skill] || `${skill} is a key ${priority.toLowerCase()}-priority skill needed to satisfy requirements for ${career || 'this role'}.`,
    nextStep: defaultNextSteps[skill] || `Start learning ${skill} through official documentation and practical hands-on exercises.`
  }));

  const highPriorityNames = sortedPriorities
    .filter(p => p.priority === 'High')
    .map(p => p.skill);

  const summary = missingSkills.length === 0
    ? `You have satisfied all core requirements for ${career || 'this career'}. Focus on building real-world portfolio projects.`
    : `To achieve readiness for ${career || 'your chosen career'}, focus on bridging key skill gaps, starting with ${highPriorityNames.length > 0 ? highPriorityNames.join(' and ') : 'your top priority skills'}.`;

  return {
    summary,
    recommendations,
    learningOrder
  };
}

/**
 * Generate AI-based recommendations or fallback
 */
async function generateRecommendations(analysisData) {
  const apiKey = process.env.AI_API_KEY;
  const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';

  // Fallback if API key is not configured or default placeholder
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return generateFallbackRecommendations(analysisData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `
You are CareerNova's AI Career Readiness Advisor.
Given the following deterministic skill gap analysis for a student pursuing "${analysisData.career}":

- Matched Skills: ${JSON.stringify(analysisData.matchedSkills)}
- Missing Skills: ${JSON.stringify(analysisData.missingSkills)}
- Partial Skills: ${JSON.stringify(analysisData.partialSkills)}
- Skill Priorities: ${JSON.stringify(analysisData.priorities)}

IMPORTANT RULES:
1. DO NOT invent any career requirements or skills that are not listed above.
2. Only analyze the skills provided in the input payload.

Generate a JSON object with EXACTLY the following format:
{
  "summary": "Concise summary of student's current skill gaps and readiness.",
  "recommendations": [
    {
      "skill": "Skill Name",
      "priority": "High | Medium | Low",
      "reason": "Short explanation of why this skill is needed and its priority.",
      "nextStep": "Practical, actionable next step to start learning this skill."
    }
  ],
  "learningOrder": ["Skill1", "Skill2", "Skill3"]
}

Respond strictly with valid JSON. Do not include markdown code block formatting.
`;

    const result = await model.generateContent(prompt);
    const responseText = result && result.response ? result.response.text().trim() : '';

    const cleanJsonText = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const parsedData = JSON.parse(cleanJsonText);

    if (parsedData.summary && Array.isArray(parsedData.recommendations) && Array.isArray(parsedData.learningOrder)) {
      return parsedData;
    }

    return generateFallbackRecommendations(analysisData);
  } catch (error) {
    console.error('AI Recommendation Service Error:', error.message);
    return generateFallbackRecommendations(analysisData);
  }
}

module.exports = {
  generateRecommendations,
  generateFallbackRecommendations
};
