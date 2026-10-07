import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { FormTemplate } from '../models/template.model.js';
import { User } from '../models/user.model.js';
import { AuthService } from '../services/auth.service.js';
import { SEED_TEMPLATES } from './seedTemplates.js';
import { logger } from '../config/logger.js';

async function seed() {
  try {
    await connectDatabase();

    // 1. Seed Admin User if not exists
    const adminEmail = 'admin@voiceform.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      logger.info('Creating default Admin user: admin@voiceform.com');
      const { user } = await AuthService.register({
        name: 'System Admin',
        email: adminEmail,
        password: 'AdminPassword123!',
        role: 'admin'
      });
      adminUser = await User.findById(user.id);
    } else {
      logger.info('Admin user already exists.');
    }

    // 2. Seed Default Form Templates
    for (const tpl of SEED_TEMPLATES) {
      const existing = await FormTemplate.findOne({ slug: tpl.slug });
      if (!existing) {
        await FormTemplate.create({
          ...tpl,
          createdBy: adminUser?._id
        });
        logger.info(`✅ Seeded template: ${tpl.title}`);
      } else {
        logger.info(`Template already exists: ${tpl.title}`);
      }
    }

    logger.info('🎉 Database seeding completed successfully.');
  } catch (err) {
    logger.error('❌ Seeding failed:', err);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

seed();
