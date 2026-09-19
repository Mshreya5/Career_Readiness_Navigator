const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Career = require('./models/Career');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careernova';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Career.deleteMany({});

    const student = await User.create({
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: 'password123', // hashed automatically by the User model
      skills: ['HTML', 'Python']
    });

    const careers = await Career.insertMany([
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
    ]);

    console.log('\n================ SEED SUCCESSFUL ================');
    console.log(`Student ID: ${student._id}  |  Skills: ${student.skills.join(', ')}`);
    console.log('Demo login -> email: alex@example.com  |  password: password123');
    careers.forEach(c => console.log(`Career: ${c.title}  |  ID: ${c._id}`));
    console.log('=================================================\n');
    console.log('Sample payload for POST /api/analysis/skill-gap:');
    console.log(JSON.stringify({ studentId: student._id, careerId: careers[0]._id }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
