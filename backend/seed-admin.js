import bcrypt from 'bcryptjs';
import db from './src/config/database.js';
import { User } from './src/models/User.js';

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findByEmail('bandarathiwanka8@gmail.com');
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('AzgR8$Zq', 10);

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'bandarathiwanka8@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: bandarathiwanka8@gmail.com');
    console.log('🔐 Password: AzgR8$Zq');
    console.log('👤 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
