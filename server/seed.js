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
      skills: ['Java', 'Python', 'HTML']
    });

    const career = await Career.create({
      title: 'Full Stack Developer',
      description: 'Develops front-end and back-end web applications.',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML'],
      recommendedSkills: ['Docker', 'TypeScript', 'Git']
    });

    console.log('\n================ SEED SUCCESSFUL ================');
    console.log(`Student Created ID: ${student._id}`);
    console.log(`Student Skills: ${student.skills.join(', ')}`);
    console.log(`Career Created ID: ${career._id}`);
    console.log(`Career Title: ${career.title}`);
    console.log(`Career Required Skills: ${career.requiredSkills.join(', ')}`);
    console.log('=================================================\n');
    console.log('Sample Request Payload for POST /api/analysis/skill-gap:');
    console.log(JSON.stringify({
      studentId: student._id.toString(),
      careerId: career._id.toString()
    }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
