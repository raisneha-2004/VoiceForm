import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { FormTemplate } from '../src/models/template.model.js';
import { SEED_TEMPLATES } from '../src/seeds/seedTemplates.js';

const app = createApp();

describe('Templates Module & RBAC', () => {
  let userToken: string;
  let adminToken: string;

  beforeEach(async () => {
    // Register normal user
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'Password123!',
      role: 'user'
    });
    userToken = userRes.body.data.tokens.accessToken;

    // Register admin user
    const adminRes = await request(app).post('/api/auth/register').send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPassword123!',
      role: 'admin'
    });
    adminToken = adminRes.body.data.tokens.accessToken;

    // Seed 1 template
    await FormTemplate.create(SEED_TEMPLATES[0]);
  });

  it('should allow public access to list published templates', async () => {
    const res = await request(app).get('/api/templates');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].slug).toBe('student-registration-form');
  });

  it('should retrieve a single template by slug or id', async () => {
    const res = await request(app).get('/api/templates/student-registration-form');
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Student Registration Form');
    expect(res.body.data.fields.length).toBeGreaterThan(0);
  });

  it('should forbid regular users from creating a template (403 Forbidden)', async () => {
    const res = await request(app)
      .post('/api/templates')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Unauthorized Template',
        description: 'Testing forbidden',
        fields: [{ id: '1', key: 'name', label: 'Name', type: 'text', required: true, order: 0 }]
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow admin to create a new template', async () => {
    const newTpl = {
      title: 'Feedback Survey Form',
      description: 'Quick customer feedback questionnaire.',
      category: 'General',
      status: 'published',
      fields: [
        { id: 'fb-1', key: 'rating', label: 'Overall Rating', type: 'number', required: true, order: 0 },
        { id: 'fb-2', key: 'comment', label: 'Comments', type: 'textarea', required: false, order: 1 }
      ]
    };

    const res = await request(app)
      .post('/api/templates')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newTpl);

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('feedback-survey-form');
    expect(res.body.data.fields.length).toBe(2);
  });

  it('should allow admin to update and toggle template publish status', async () => {
    const tpl = await FormTemplate.findOne({ slug: 'student-registration-form' });

    const toggleRes = await request(app)
      .patch(`/api/templates/${tpl!._id}/publish`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(toggleRes.status).toBe(200);
    expect(toggleRes.body.data.status).toBe('draft');
  });
});
