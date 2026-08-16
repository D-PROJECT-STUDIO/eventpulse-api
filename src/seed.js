import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Category from './models/Category.js';
import Event from './models/Event.js';
import Message from './models/Message.js';
import Registration from './models/Registration.js';
import User from './models/User.js';

const seed = async () => {
  await connectDB();
  await Message.deleteMany();
  await Registration.deleteMany();
  await Event.deleteMany();
  await Category.deleteMany();
  await User.deleteMany();

  const password = await bcrypt.hash('admin123', 12);
  const admin = await User.create({
    name: 'EventPulse Admin',
    email: 'admin@eventpulse.com',
    password,
    role: 'admin'
  });

  const categories = await Category.insertMany([
    { name: 'Music', description: 'Concerts and music events' },
    { name: 'Tech', description: 'Technology events and workshops' },
    { name: 'Sports', description: 'Sports events and activities' }
  ]);

  await Event.insertMany([
    {
      title: 'Cairo Tech Day',
      description: 'A full day of technology talks and workshops',
      category: categories[1]._id,
      date: new Date('2026-10-15T10:00:00Z'),
      city: 'Cairo',
      venue: 'Smart Village',
      capacity: 100,
      organizer: admin._id
    },
    {
      title: 'Alex Music Night',
      description: 'Live music by local bands',
      category: categories[0]._id,
      date: new Date('2026-11-05T18:00:00Z'),
      city: 'Alexandria',
      venue: 'Bibliotheca Plaza',
      capacity: 150,
      organizer: admin._id
    },
    {
      title: 'Community Football Day',
      description: 'A friendly football event for everyone',
      category: categories[2]._id,
      date: new Date('2026-12-12T14:00:00Z'),
      city: 'Giza',
      venue: 'Youth Center',
      capacity: 50,
      organizer: admin._id
    }
  ]);

  console.log('Seed completed');
  console.log('Admin email: admin@eventpulse.com');
  console.log('Admin password: admin123');
  await mongoose.disconnect();
};

seed().catch(error => {
  console.error(error.message);
  process.exit(1);
});
