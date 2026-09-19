const mongoose = require('mongoose');
const Career = require('../models/Career');

const DEFAULT_CAREERS = [
  {
    title: 'Full Stack Developer',
    description: 'Develops full-stack web applications across frontend, backend and databases.',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'HTML', 'CSS', 'Git', 'SQL'],
    recommendedSkills: ['Docker', 'Next.js', 'REST APIs', 'System Design']
  },
  {
    title: 'Data Scientist',
    description: 'Analyzes complex datasets, extracts insights, and builds machine learning models.',
    requiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistics', 'Machine Learning', 'Data Visualization'],
    recommendedSkills: ['TensorFlow', 'PyTorch', 'Tableau', 'Big Data']
  },
  {
    title: 'Frontend Developer',
    description: 'Engineers high-performance, responsive user interfaces and web applications.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind', 'Git'],
    recommendedSkills: ['Figma', 'Next.js', 'Web Performance', 'Redux']
  },
  {
    title: 'Backend Developer',
    description: 'Architects and maintains secure server-side logic, databases, microservices and APIs.',
    requiredSkills: ['JavaScript', 'Node.js', 'Express', 'Python', 'SQL', 'MongoDB', 'Git'],
    recommendedSkills: ['Docker', 'PostgreSQL', 'Redis', 'GraphQL', 'Microservices']
  },
  {
    title: 'DevOps Engineer',
    description: 'Automates deployment pipelines, cloud infrastructure, monitoring and security.',
    requiredSkills: ['Linux', 'Docker', 'Git', 'Python', 'Bash', 'CI/CD', 'SQL'],
    recommendedSkills: ['Kubernetes', 'Terraform', 'AWS', 'Monitoring']
  }
];

const ensureDefaultCareers = async () => {
  try {
    const count = await Career.countDocuments();
    if (count === 0) {
      await Career.insertMany(DEFAULT_CAREERS);
      console.log('Successfully auto-seeded default careers in MongoDB!');
    }
  } catch (err) {
    console.error('Auto-seed careers error:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careernova');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await ensureDefaultCareers();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
