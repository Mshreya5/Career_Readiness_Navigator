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
      skills: ['HTML', 'Python']
    });

    const careers = await Career.insertMany([
      {
        title: 'Full Stack Developer',
        description: 'Develops front-end and back-end web applications.',
        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML', 'CSS'],
        recommendedSkills: ['Docker', 'TypeScript', 'Git']
      },
      {
        title: 'Data Scientist',
        description: 'Analyzes data and builds machine learning models.',
        requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'NumPy'],
        recommendedSkills: ['TensorFlow', 'Tableau', 'R']
      },
      {
        title: 'Frontend Developer',
        description: 'Builds user interfaces and web experiences.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'],
        recommendedSkills: ['Figma', 'Tailwind', 'Next.js']
      },
      {
        title: 'DevOps Engineer',
        description: 'Manages CI/CD pipelines and cloud infrastructure.',
        requiredSkills: ['Docker', 'Git', 'Linux', 'Python', 'SQL'],
        recommendedSkills: ['Kubernetes', 'Terraform', 'AWS']
      }
    ]);

    console.log('\n================ SEED SUCCESSFUL ================');
    console.log(`Student ID: ${student._id}  |  Skills: ${student.skills.join(', ')}`);
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
