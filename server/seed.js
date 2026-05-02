const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Admin = mongoose.model('Admin', adminSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rastura';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const newAdmin = new Admin({
      username: 'admin',
      password: hashedPassword
    });

    await newAdmin.save();
    console.log('Admin user created successfully! Username: admin, Password: admin123');

  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();
