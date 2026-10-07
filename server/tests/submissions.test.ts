import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { FormTemplate } from '../src/models/template.model.js';
import { SEED_TEMPLATES } from '../src/seeds/seedTemplates.js';

const app = createApp();

describe('Submissions Module', () => {
  let userToken: string;
  let templateId: string;

  beforeEach(async () => {
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Sneha Form User',
      email: 'sneha.sub@example.com',
      password: 'SecurePassword123!'
    });
    userToken = userRes.body.data.tokens.accessToken;

    const tpl = await FormTemplate.create(SEED_TEMPLATES[2]); // Contact & Support Form (shorter)
    templateId = tpl._id.toString();
  });

  it('should create a new draft submission and calculate initial completion', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        templateId,
        title: 'My Support Request Draft'
      });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('draft');
    expect(res.body.data.completionPercentage).toBe(0);
    expect(res.body.data.values).toEqual({});
  });

  it('should update submission values and auto-recalculate completion percentage', async () => {
    const createRes = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ templateId });

    const submissionId = createRes.body.data.id;

    // Contact form has 4 required fields: fullName, email, category, subject, message (5 total)
    const updateRes = await request(app)
      .patch(`/api/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        values: {
          fullName: 'Sneha Rai',
          email: 'sneha@example.com'
        }
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.values.fullName).toBe('Sneha Rai');
    expect(updateRes.body.data.values.email).toBe('sneha@example.com');
    expect(updateRes.body.data.completionPercentage).toBeGreaterThan(0);
    expect(updateRes.body.data.status).toBe('in_progress');
  });

  it('should reject submission submit if required fields are missing', async () => {
    const createRes = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ templateId });

    const submissionId = createRes.body.data.id;

    const submitRes = await request(app)
      .post(`/api/submissions/${submissionId}/submit`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(submitRes.status).toBe(422);
    expect(submitRes.body.success).toBe(false);
    expect(submitRes.body.error.code).toBe('ValidationError');
    expect(submitRes.body.error.details.length).toBeGreaterThan(0);
  });

  it('should submit successfully when all required fields are filled and lock the form', async () => {
    const createRes = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ templateId });

    const submissionId = createRes.body.data.id;

    // Fill all required fields for contact form: fullName, email, category, subject, message
    await request(app)
      .patch(`/api/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        values: {
          fullName: 'Sneha Rai',
          email: 'sneha@example.com',
          category: 'support',
          subject: 'Issue with audio mic input',
          message: 'Detailed message explaining the issue in complete depth and clarity.'
        }
      });

    const submitRes = await request(app)
      .post(`/api/submissions/${submissionId}/submit`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.status).toBe('submitted');
    expect(submitRes.body.data.completionPercentage).toBe(100);

    // Any subsequent modification should be rejected because form is locked
    const modifyAfterSubmit = await request(app)
      .patch(`/api/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ values: { fullName: 'Hacker Attempt' } });

    expect(modifyAfterSubmit.status).toBe(400);
    expect(modifyAfterSubmit.body.error.message).toContain('Submitted forms cannot be modified');
  });

  it('should clone / duplicate an existing submission into a new draft', async () => {
    const createRes = await request(app)
      .post('/api/submissions')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        templateId,
        title: 'Original Submission',
        initialValues: { fullName: 'Sneha Rai' }
      });

    const originalId = createRes.body.data.id;

    const dupRes = await request(app)
      .post(`/api/submissions/${originalId}/duplicate`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(dupRes.status).toBe(201);
    expect(dupRes.body.data.id).not.toBe(originalId);
    expect(dupRes.body.data.title).toContain('(Copy)');
    expect(dupRes.body.data.values.fullName).toBe('Sneha Rai');
  });
});
