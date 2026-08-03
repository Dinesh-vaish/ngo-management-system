'use strict';
require('dotenv').config();
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const User      = require('../models/User');
const Admin     = require('../models/Admin');
const Donor     = require('../models/Donor');
const Volunteer = require('../models/Volunteer');
const Campaign  = require('../models/Campaign');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(' Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Admin.deleteMany({}),
    Donor.deleteMany({}), Volunteer.deleteMany({}),
    Campaign.deleteMany({}),
  ]);

  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;

  // Admin
  const adminUser = await User.create({
    name: 'Super Admin', email: 'admin@manara-nexus.org',
    password: await bcrypt.hash('Admin@123', rounds),
    phone: '9000000001', role: 'admin', city: 'Bengaluru',
  });
  await Admin.create({ user_id: adminUser._id, username: 'superadmin' });

  // Donor
  const donorUser = await User.create({
    name: 'Ravi Kumar', email: 'ravi@example.com',
    password: await bcrypt.hash('Donor@123', rounds),
    phone: '9000000002', role: 'donor', city: 'Bengaluru',
  });
  await Donor.create({ user_id: donorUser._id, address: '12 MG Road, Bengaluru', total_donated: 0 });

  // Volunteer
  const volUser = await User.create({
    name: 'Neha Reddy', email: 'neha@example.com',
    password: await bcrypt.hash('Vol@12345', rounds),
    phone: '9000000003', role: 'volunteer', city: 'Hyderabad',
  });
  await Volunteer.create({ user_id: volUser._id, interests: 'Education, Healthcare', dob: new Date('2000-05-15') });

  // Sample Campaign
  await Campaign.create({
    admin_id: adminUser._id,
    title: 'Feed 500 Families This Winter',
    description: 'Help us provide warm meals to 500 families across Bengaluru this winter.',
    target_amount: 100000, collected_amount: 72000,
    start_date: new Date('2026-07-01'), end_date: new Date('2026-12-31'),
    status: 'active', city: 'Bengaluru',
  });

  console.log('');
  console.log('Seed complete!');
  console.log('   Admin     → admin@manara-nexus.org  / Admin@123');
  console.log('   Donor     → ravi@example.com        / Donor@123');
  console.log('   Volunteer → neha@example.com        / Vol@12345');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error(' Seed failed:', err.message);
  process.exit(1);
});
