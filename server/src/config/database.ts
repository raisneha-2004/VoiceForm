import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

let memoryServerInstance: any = null;

export async function connectDatabase(uri?: string): Promise<typeof mongoose> {
  let targetUri = uri || env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 3000,
      autoIndex: true
    });
    logger.info(`✅ MongoDB Connected to database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost. Reconnecting...');
    });

    return conn;
  } catch (error) {
    if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
      logger.warn(`Local MongoDB at ${targetUri} not reachable. Automatically launching embedded MongoDB instance...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        targetUri = memoryServerInstance.getUri();

        const conn = await mongoose.connect(targetUri, { autoIndex: true });
        logger.info(`✅ Embedded MongoDB ready: ${targetUri}`);

        return conn;
      } catch (innerErr) {
        logger.error('Failed to start embedded MongoDB:', innerErr);
        throw innerErr;
      }
    }

    logger.error(`❌ MongoDB connection failed for ${targetUri}:`, error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected.');
  }

  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
  }
}
