import { env } from './env.js';

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'refreshtoken',
  'accesstoken',
  'token',
  'secret',
  'authorization',
  'cookie',
  'gemini_api_key',
  'openai_api_key'
]);

function maskSensitiveData(obj: any, depth = 0): any {
  if (depth > 5 || !obj) return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveData(item, depth + 1));
  }

  const masked: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      masked[key] = '***MASKED***';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value, depth + 1);
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

export const logger = {
  info(message: string, meta?: Record<string, any>) {
    const payload = meta ? ` | ${JSON.stringify(maskSensitiveData(meta))}` : '';
    console.log(`[INFO] [${new Date().toISOString()}] ${message}${payload}`);
  },
  warn(message: string, meta?: Record<string, any>) {
    const payload = meta ? ` | ${JSON.stringify(maskSensitiveData(meta))}` : '';
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}${payload}`);
  },
  error(message: string, error?: any, meta?: Record<string, any>) {
    const errorDetails = error instanceof Error
      ? { message: error.message, stack: env.NODE_ENV !== 'production' ? error.stack : undefined }
      : error;
    const merged = { ...meta, error: errorDetails };
    console.error(`[ERROR] [${new Date().toISOString()}] ${message} | ${JSON.stringify(maskSensitiveData(merged))}`);
  },
  debug(message: string, meta?: Record<string, any>) {
    if (env.NODE_ENV === 'development') {
      const payload = meta ? ` | ${JSON.stringify(maskSensitiveData(meta))}` : '';
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}${payload}`);
    }
  }
};
