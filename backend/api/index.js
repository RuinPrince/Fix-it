import app from '../src/app.js';
import { connectDB, syncDB } from '../src/config/database.js';
import { User, UserProfile } from '../src/models/index.js';
import bcrypt from 'bcryptjs';

let initialized = false;

// Vercel serverless function entrypoint
export default async (req, res) => {
  if (!initialized) {
    await connectDB();
    await syncDB();
    
    // Auto-seed admin user if DB is empty on Vercel
    if (process.env.VERCEL === '1') {
      const adminExists = await User.findOne({ where: { email: 'admin@fixit.gov.in' } });
      if (!adminExists) {
        const password_hash = await bcrypt.hash('password123', 12);
        const admin = await User.create({ email: 'admin@fixit.gov.in', password_hash, role: 'admin', phone: '+91-9000000002' }, { individualHooks: false });
        await UserProfile.create({ user_id: admin.id, full_name: 'Arun Patel (Admin)', address: 'Admin Office' });
      }
    }
    
    initialized = true;
  }
  return app(req, res);
};
