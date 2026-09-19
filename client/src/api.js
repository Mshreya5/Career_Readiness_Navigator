const BASE = '/api';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data;
}

export const api = {
  upsertStudent: (payload) => request('POST', '/roadmap/student', payload),
  getCareers: () => request('GET', '/roadmap/careers'),
  generateRoadmap: (payload) => request('POST', '/roadmap/generate', payload),
  getRoadmap: (studentId, careerId) => request('GET', `/roadmap/${studentId}/${careerId}`),
  updateMilestone: (roadmapId, milestoneId, status) =>
    request('PATCH', `/roadmap/${roadmapId}/milestone/${milestoneId}`, { status }),
  getProgress: (roadmapId) => request('GET', `/roadmap/${roadmapId}/progress`)
};
