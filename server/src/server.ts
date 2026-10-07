import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

async function startServer() {
  try {
    await connectDatabase();

    // Auto-seed initial templates if empty
    const { FormTemplate } = await import('./models/template.model.js');
    const { SEED_TEMPLATES } = await import('./seeds/seedTemplates.js');
    const templateCount = await FormTemplate.countDocuments();
    if (templateCount === 0) {
      logger.info('No templates detected in database. Auto-seeding initial templates...');
      for (const tpl of SEED_TEMPLATES) {
        await FormTemplate.create(tpl);
      }
      logger.info('✅ Initial templates auto-seeded.');
    }

    const app = createApp();
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 VoiceForm REST API running in '${env.NODE_ENV}' mode on port ${env.PORT}`);
      logger.info(`📚 Swagger Documentation available at: http://localhost:${env.PORT}/api/docs`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force exit after 10 seconds if hanging
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    process.on('unhandledRejection', (reason: any) => {
      logger.error('Unhandled Promise Rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Fatal Server Startup Error:', error);
    process.exit(1);
  }
}

startServer();
