import type { AIProvider } from './aiProvider.interface.js';
import { MockAIProvider } from './mockAiProvider.js';
import { GeminiAIProvider } from './geminiProvider.js';
import { OpenAIProvider } from './openaiProvider.js';
import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';

export class AIFactory {
  private static instance: AIProvider;

  static getProvider(): AIProvider {
    if (this.instance) return this.instance;

    const providerType = env.AI_PROVIDER;

    switch (providerType) {
      case 'gemini':
        logger.info('Initializing Gemini AI Provider');
        this.instance = new GeminiAIProvider();
        break;
      case 'openai':
        logger.info('Initializing OpenAI Provider');
        this.instance = new OpenAIProvider();
        break;
      case 'mock':
      default:
        logger.info('Initializing Mock/Rule-based AI Provider');
        this.instance = new MockAIProvider();
        break;
    }

    return this.instance;
  }
}
