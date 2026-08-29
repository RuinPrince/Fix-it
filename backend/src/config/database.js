// ============================================
// Fix It — Sequelize MySQL Database Config
// ============================================
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

// Vercel serverless environment is read-only except for /tmp
const isVercel = process.env.VERCEL === '1';
const storagePath = isVercel ? '/tmp/fixit_database.sqlite' : './fixit_database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: (msg) => logger.debug(msg),
  define: {
    timestamps: true,
    underscored: true,
  },
});

/**
 * Test database connection
 */
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ MySQL database connected successfully');
  } catch (error) {
    logger.error('❌ Unable to connect to MySQL:', error.message);
    logger.info('💡 Make sure MySQL is running. You can start it with Docker:');
    logger.info('   docker run -d --name fixit-mysql -e MYSQL_ROOT_PASSWORD=fixit_password -e MYSQL_DATABASE=fixit_db -p 3306:3306 mysql:8.0');
    // Don't crash — allow the app to start for demo/frontend work
  }
};

/**
 * Sync all models with database
 */
export const syncDB = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    logger.info(`✅ Database synced ${force ? '(force)' : '(alter)'}`);
  } catch (error) {
    logger.error('❌ Database sync failed:', error.message);
  }
};

export default sequelize;
