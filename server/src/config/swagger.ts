import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'VoiceForm REST API',
    version: '1.0.0',
    description:
      'Production-grade REST API for VoiceForm: An AI-powered multilingual conversational form filling engine.'
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Access token'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'ValidationError' },
              message: { type: 'string', example: 'Validation failed' },
              details: { type: 'array', items: { type: 'object' } }
            }
          },
          requestId: { type: 'string', example: 'd3b07384-d113-4694-8fcf-33678000572b' },
          timestamp: { type: 'string', example: '2026-09-17T12:00:00.000Z' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'System health check',
        responses: {
          200: { description: 'Server is healthy' }
        }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Sneha Rai' },
                  email: { type: 'string', example: 'sneha.rai@example.com' },
                  password: { type: 'string', example: 'P@ssword123' },
                  role: { type: 'string', enum: ['user', 'admin'], default: 'user' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered' }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate and receive JWT tokens',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'sneha.rai@example.com' },
                  password: { type: 'string', example: 'P@ssword123' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful with access & refresh tokens' }
        }
      }
    },
    '/templates': {
      get: {
        summary: 'List available form templates',
        tags: ['Templates'],
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of templates' }
        }
      }
    },
    '/voice/process': {
      post: {
        summary: 'Process conversational voice transcript',
        tags: ['Voice & AI'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['submissionId', 'templateId', 'transcript'],
                properties: {
                  submissionId: { type: 'string' },
                  templateId: { type: 'string' },
                  transcript: {
                    type: 'string',
                    example: 'My name is Sneha Rai, I am 21 years old and my email is sneharai@gmail.com'
                  },
                  language: { type: 'string', enum: ['en-IN', 'hi-IN', 'hinglish'] },
                  activeFieldKey: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Extracted field updates, commands, and next questions' }
        }
      }
    }
  }
};

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
