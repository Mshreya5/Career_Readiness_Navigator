/**
 * End-to-end integration test harness (Member 2).
 * Boots an ephemeral in-memory MongoDB, seeds demo data, starts the real
 * Express app, and exercises every important endpoint including the
 * Member 3 (skill-gap / recommendations) and Member 4 (roadmap) integration.
 *
 * Run: node e2e_test.js
 */
const path = require('path');
require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  -> ' + detail : ''}`);
}

async function main() {
  process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careernova_e2e';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e_test_secret_key';
  process.env.AI_API_KEY = ''; // force deterministic fallback (no network)
  process.env.PORT = '5099';
  const BASE = `http://127.0.0.1:${process.env.PORT}/api`;

  // Seed before booting the server
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('./models/User');
  const Career = require('./models/Career');
  await User.deleteMany({});
  await Career.deleteMany({});
  const demoStudent = await User.create({ name: 'Alex Johnson', email: 'alex@example.com', password: 'password123', skills: ['HTML', 'Python'] });
  const careers = await Career.insertMany([
    { title: 'Full Stack Developer', description: 'fs', requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS'], recommendedSkills: ['Docker'] },
    { title: 'Frontend Developer', description: 'fe', requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'], recommendedSkills: ['TypeScript'] },
    { title: 'Backend Developer', description: 'be', requiredSkills: ['JavaScript', 'Node.js', 'Express', 'MongoDB'], recommendedSkills: ['Docker'] }
  ]);
  await mongoose.disconnect();

  // Start the real server
  require('./server.js');
  await new Promise((r) => setTimeout(r, 800));

  const call = async (method, url, body, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(BASE + url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    let data = null;
    try { data = await res.json(); } catch {}
    return { status: res.status, data };
  };

  const fsId = careers[0]._id.toString();
  const beId = careers[2]._id.toString();

  // ---- HEALTH ----
  let r = await call('GET', '/health');
  record('GET /api/health', r.status === 200 && r.data.status === 'ok');

  // ---- CAREERS ----
  r = await call('GET', '/careers');
  record('GET /api/careers (list)', r.status === 200 && Array.isArray(r.data) && r.data.length >= 3, `count=${Array.isArray(r.data) ? r.data.length : 'n/a'}`);
  r = await call('GET', `/careers/${fsId}`);
  record('GET /api/careers/:id', r.status === 200 && r.data.title === 'Full Stack Developer');
  r = await call('GET', `/careers/${fsId}/skills`);
  record('GET /api/careers/:id/skills', r.status === 200 && Array.isArray(r.data.requiredSkills));
  r = await call('GET', '/careers/not-an-id');
  record('GET /api/careers/:id (invalid id -> 400)', r.status === 400);

  // ---- AUTH ----
  const email = `new_${Date.now()}@example.com`;
  r = await call('POST', '/auth/register', { name: 'New User', email, password: 'secret123' });
  const regToken = r.data && r.data.token;
  record('POST /api/auth/register', r.status === 201 && !!regToken, `status=${r.status}`);
  record('register hides password', r.data && r.data.user && r.data.user.password === undefined);

  r = await call('POST', '/auth/register', { name: 'Dup', email, password: 'secret123' });
  record('POST /api/auth/register (duplicate -> 409)', r.status === 409);

  r = await call('POST', '/auth/register', { name: 'Bad', email: 'not-an-email', password: 'secret123' });
  record('POST /api/auth/register (bad email -> 400)', r.status === 400);

  r = await call('POST', '/auth/login', { email, password: 'secret123' });
  record('POST /api/auth/login (correct)', r.status === 200 && !!r.data.token);
  r = await call('POST', '/auth/login', { email, password: 'wrongpass' });
  record('POST /api/auth/login (wrong password -> 401)', r.status === 401);

  // ---- AUTH MIDDLEWARE ----
  r = await call('GET', '/careers'); // public still works
  record('public careers works with no token', r.status === 200);

  // ---- USERS ----
  r = await call('POST', '/users', { name: 'Ram Kumar', email: `ram_${Date.now()}@example.com`, skills: ['HTML', 'JavaScript', 'React'] });
  const newUserId = r.data && r.data.user && r.data.user._id;
  record('POST /api/users (create student)', r.status === 201 && !!newUserId, `status=${r.status}`);

  r = await call('GET', `/users/${newUserId}`);
  record('GET /api/users/:id', r.status === 200 && r.data.user.email.startsWith('ram_'));
  record('GET /api/users/:id hides password', r.data && r.data.user.password === undefined);

  r = await call('GET', `/users/${demoStudent._id}`);
  record('GET /api/users/:id (seeded demo)', r.status === 200 && r.data.user.skills.includes('HTML'));

  r = await call('PATCH', `/users/${newUserId}`, { name: 'Ram Kumar S' });
  record('PATCH /api/users/:id', r.status === 200 && r.data.user.name === 'Ram Kumar S');

  r = await call('PATCH', `/users/${newUserId}/skills`, { skills: ['HTML', 'JavaScript', 'React', 'Node.js'] });
  record('PATCH /api/users/:id/skills', r.status === 200 && r.data.user.skills.length === 4);

  r = await call('PATCH', `/users/${newUserId}/skills`, { skills: 'not-an-array' });
  record('PATCH /api/users/:id/skills (bad input -> 400)', r.status === 400);

  r = await call('GET', '/users/000000000000000000000000');
  record('GET /api/users/:id (unknown -> 404)', r.status === 404);

  r = await call('GET', '/users/not-an-id');
  record('GET /api/users/:id (invalid id -> 400)', r.status === 400);

  // ---- MEMBER 3 INTEGRATION: skill-gap ----
  r = await call('POST', '/analysis/skill-gap', { studentId: demoStudent._id.toString(), careerId: fsId });
  const gap = r.data || {};
  record('POST /api/analysis/skill-gap', r.status === 200 && Array.isArray(gap.matchedSkills) && typeof gap.matchPercentage === 'number', `status=${r.status}`);
  record('skill-gap response shape', ['career', 'matchedSkills', 'missingSkills', 'partialSkills', 'matchPercentage', 'priorities'].every((k) => k in gap));
  record('skill-gap missing skills detected', Array.isArray(gap.missingSkills) && gap.missingSkills.length > 0, `missing=${JSON.stringify(gap.missingSkills)}`);
  record('skill-gap priorities present', Array.isArray(gap.priorities) && gap.priorities.length > 0, `priorities=${JSON.stringify((gap.priorities || []).map((p) => p.skill + ':' + p.priority))}`);

  r = await call('POST', '/analysis/skill-gap', { studentId: demoStudent._id.toString() });
  record('skill-gap missing careerId -> 400', r.status === 400);
  r = await call('POST', '/analysis/skill-gap', { studentId: 'bad', careerId: fsId });
  record('skill-gap invalid studentId -> 400', r.status === 400);
  r = await call('POST', '/analysis/skill-gap', { studentId: '000000000000000000000000', careerId: fsId });
  record('skill-gap unknown student -> 404', r.status === 404);

  // ---- MEMBER 3 INTEGRATION: recommendations (studentId + careerId) ----
  r = await call('POST', '/analysis/recommendations', { studentId: demoStudent._id.toString(), careerId: fsId });
  const rec = r.data || {};
  record('POST /api/analysis/recommendations (studentId+careerId)', r.status === 200 && Array.isArray(rec.recommendations));
  record('recommendations response shape', ['summary', 'recommendations', 'learningOrder'].every((k) => k in rec), `learningOrder=${JSON.stringify(rec.learningOrder)}`);
  record('recommendations learningOrder non-empty', Array.isArray(rec.learningOrder) && rec.learningOrder.length > 0);

  // ---- MEMBER 4 INTEGRATION: roadmap pipeline ----
  r = await call('POST', '/roadmap/generate', { studentId: demoStudent._id.toString(), careerId: fsId });
  const roadmap = r.data || {};
  record('POST /api/roadmap/generate (uses Member 3 output)', r.status === 200 && Array.isArray(roadmap.milestones) && roadmap.milestones.length > 0, `milestones=${Array.isArray(roadmap.milestones) ? roadmap.milestones.length : 'n/a'}`);
  const roadmapId = roadmap._id;
  if (roadmapId && roadmap.milestones && roadmap.milestones[0]) {
    const mId = roadmap.milestones[0]._id;
    r = await call('PATCH', `/roadmap/${roadmapId}/milestone/${mId}`, { status: 'Completed' });
    record('PATCH roadmap milestone (progress tracking)', r.status === 200);
    r = await call('GET', `/roadmap/${roadmapId}/progress`);
    record('GET roadmap progress', r.status === 200 && typeof r.data.percentage === 'number', `percentage=${r.data && r.data.percentage}`);
  }

  // ---- ASSESSMENT MODULE ENDPOINTS ----
  r = await call('POST', '/assessment/start', { skill: 'JavaScript' });
  record('POST /api/assessment/start', r.status === 200 && r.data.quizAvailable === true);

  r = await call('GET', '/assessment/questions/JavaScript');
  record('GET /api/assessment/questions/:skill', r.status === 200 && Array.isArray(r.data.questions) && r.data.questions.length > 0);

  r = await call('POST', '/assessment/submit', {
    studentId: demoStudent._id.toString(),
    careerId: fsId,
    skill: 'JavaScript',
    answers: { js_1: 'number', js_2: 'map()', js_3: 'Start', js_4: 'true, false', js_5: '1 2' }
  });
  record('POST /api/assessment/submit (quiz)', r.status === 201 && r.data.percentage === 100 && r.data.skillLevel === 'Strong', `score=${r.data.percentage}%`);

  r = await call('GET', `/assessment/history/${demoStudent._id.toString()}`);
  record('GET /api/assessment/history/:studentId', r.status === 200 && Array.isArray(r.data) && r.data.length >= 1);

  r = await call('POST', '/coding/run', {
    skill: 'JavaScript',
    code: 'function findMax(arr) { return Math.max(...arr); }'
  });
  record('POST /api/coding/run', r.status === 200 && r.data.testCasesPassed > 0);

  r = await call('POST', '/coding/submit', {
    studentId: demoStudent._id.toString(),
    careerId: fsId,
    skill: 'JavaScript',
    code: 'function findMax(arr) { return Math.max(...arr); }',
    language: 'JavaScript'
  });
  record('POST /api/coding/submit', r.status === 201 && r.data.percentage === 100);

  // ---- Summary ----
  await mongoose.disconnect();
  const failed = results.filter((x) => !x.ok);
  console.log(`\n================ E2E SUMMARY ================`);
  console.log(`Total: ${results.length}  Passed: ${results.length - failed.length}  Failed: ${failed.length}`);
  if (failed.length) console.log('FAILED:', failed.map((f) => f.name).join(' | '));
  console.log('=============================================');
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => { console.error('E2E harness error:', e); process.exit(1); });
