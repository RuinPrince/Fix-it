import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let initialized = false;
let appInstance = null;
let topLevelError = null;
let initError = null;

try {
  // Force Vercel's bundler to include sqlite3 (Sequelize requires it dynamically)
  require('sqlite3');
} catch (err) {
  topLevelError = err;
}

// Vercel serverless function entrypoint
export default async (req, res) => {
  if (topLevelError) {
    return res.status(500).json({ error: 'Top-level crash', message: topLevelError.message, stack: topLevelError.stack });
  }

  if (!initialized) {
    try {
      // Dynamic imports to catch top-level crash
      const { default: app } = await import('../src/app.js');
      const { connectDB, syncDB } = await import('../src/config/database.js');
      const { User, UserProfile } = await import('../src/models/index.js');
      const bcrypt = (await import('bcryptjs')).default;
      
      appInstance = app;
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
    } catch (err) {
      initError = err;
      return res.status(500).json({ error: 'Initialization failed', message: err.message, stack: err.stack });
    }
  }
  
  if (initError) {
    return res.status(500).json({ error: 'Previous initialization failed', message: initError.message, stack: initError.stack });
  }

  return appInstance(req, res);
};
