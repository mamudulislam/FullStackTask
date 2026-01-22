const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const ORSPlan = require('./models/ORSPlan');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ORSPlan.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      username: 'admin_user',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
    });

    const inspector = await User.create({
      username: 'inspector_user',
      email: 'inspector@test.com',
      password: 'inspector123',
      role: 'inspector',
    });

    const viewer = await User.create({
      username: 'viewer_user',
      email: 'viewer@test.com',
      password: 'viewer123',
      role: 'viewer',
    });

    console.log('Users created:', {
      admin: admin._id,
      inspector: inspector._id,
      viewer: viewer._id,
    });

    // Create ORS Plans
    const plan1 = await ORSPlan.create({
      vehicle: 'Truck-12',
      roadWorthinessScore: '78%',
      overallTrafficScore: 'B',
      actionRequired: 'Replace worn brake pads',
      documents: [
        {
          textDocs: [
            { label: 'Brake Inspection', description: 'Brake pads worn 60%' },
            { label: 'Engine Check', description: 'Engine running smoothly' },
          ],
          attachments: ['brake_report.pdf', 'engine_log.txt'],
        },
      ],
      createdBy: inspector._id,
      assignedTo: viewer._id,
    });

    const plan2 = await ORSPlan.create({
      vehicle: 'Van-45',
      roadWorthinessScore: '92%',
      overallTrafficScore: 'A',
      actionRequired: 'None',
      documents: [
        {
          textDocs: [
            { label: 'Full Inspection', description: 'All systems functioning normally' },
          ],
          attachments: ['inspection_report.pdf'],
        },
      ],
      createdBy: admin._id,
      assignedTo: viewer._id,
    });

    const plan3 = await ORSPlan.create({
      vehicle: 'Bus-23',
      roadWorthinessScore: '65%',
      overallTrafficScore: 'D',
      actionRequired: 'Replace brake fluid, check suspension',
      documents: [
        {
          textDocs: [
            { label: 'Brake Fluid Check', description: 'Low brake fluid level' },
            { label: 'Suspension Test', description: 'Worn suspension components detected' },
          ],
          attachments: ['maintenance_log.pdf'],
        },
      ],
      createdBy: inspector._id,
      assignedTo: viewer._id,
    });

    console.log('ORS Plans created:', {
      plan1: plan1._id,
      plan2: plan2._id,
      plan3: plan3._id,
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
