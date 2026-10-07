import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { FormTemplate } from '../src/models/template.model.js';
import { FormSubmission } from '../src/models/submission.model.js';
import { SEED_TEMPLATES } from '../src/seeds/seedTemplates.js';

const app = createApp();

describe('Voice & AI Processing Module', () => {
  let userToken: string;
  let templateId: string;
  let submissionId: string;

  beforeEach(async () => {
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Sneha Voice Tester',
      email: 'sneha.voice@example.com',
      password: 'SecurePassword123!'
    });
    userToken = userRes.body.data.tokens.accessToken;

    const tpl = await FormTemplate.create(SEED_TEMPLATES[0]); // Student Registration Form
    templateId = tpl._id.toString();

    const sub = await FormSubmission.create({
      userId: userRes.body.data.user.id,
      templateId: tpl._id,
      title: 'Student Reg Voice Session'
    });
    submissionId = sub._id.toString();
  });

  it('should extract natural language multi-field input correctly', async () => {
    // "My name is Sneha Rai, my email is sneharai@gmail.com and I live in Noida"
    const res = await request(app)
      .post('/api/voice/process')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        submissionId,
        templateId,
        transcript: 'My name is Sneha Rai and my email is sneharai@gmail.com and I live in Noida',
        language: 'en-IN'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const updates = res.body.data.updates;
    expect(updates.some((u: any) => u.fieldKey === 'fullName' && u.value === 'Sneha Rai')).toBe(true);
    expect(updates.some((u: any) => u.fieldKey === 'city' && u.value === 'Noida')).toBe(true);
  });

  it('should process correction commands and overwrite specified field', async () => {
    // First set city to Noida
    await request(app)
      .post('/api/voice/process')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        submissionId,
        templateId,
        transcript: 'I live in Noida'
      });

    // Now issue correction: "Change my city to Delhi"
    const corrRes = await request(app)
      .post('/api/voice/process')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        submissionId,
        templateId,
        transcript: 'Change my city to Delhi'
      });

    expect(corrRes.status).toBe(200);
    const updates = corrRes.body.data.updates;
    expect(updates.some((u: any) => u.fieldKey === 'city' && u.value === 'Delhi')).toBe(true);

    // Verify persisted in submission
    const sub = await FormSubmission.findById(submissionId);
    expect(sub?.values.city).toBe('Delhi');
    expect(sub?.voiceMetrics.correctionsCount).toBeGreaterThanOrEqual(1);
  });

  it('should handle clear field command', async () => {
    await request(app)
      .patch(`/api/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ values: { city: 'Noida' } });

    const clearRes = await request(app)
      .post('/api/voice/process')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        submissionId,
        templateId,
        transcript: 'Clear city'
      });

    expect(clearRes.status).toBe(200);
    expect(clearRes.body.data.intent).toBe('command');

    const sub = await FormSubmission.findById(submissionId);
    expect(sub?.values.city).toBeUndefined();
  });

  it('should handle navigation commands like "Next field"', async () => {
    const nextRes = await request(app)
      .post('/api/voice/process')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        submissionId,
        templateId,
        transcript: 'Next field'
      });

    expect(nextRes.status).toBe(200);
    expect(nextRes.body.data.intent).toBe('command');
    expect(nextRes.body.data.nextQuestion).toBeDefined();
  });

  it('should return review summary for voice form review', async () => {
    await request(app)
      .patch(`/api/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ values: { fullName: 'Sneha Rai', city: 'Noida' } });

    const reviewRes = await request(app)
      .post('/api/voice/review')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ submissionId });

    expect(reviewRes.status).toBe(200);
    expect(reviewRes.body.data.filledCount).toBe(2);
    expect(reviewRes.body.data.summaryText).toContain('You have completed 2 fields');
  });

  it('should support sensitive field confirmation flow', async () => {
    const confirmRes = await request(app)
      .post('/api/voice/confirm-sensitive')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        submissionId,
        fieldKey: 'phone',
        value: '+919876543210',
        confirmed: true
      });

    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.data.success).toBe(true);

    const sub = await FormSubmission.findById(submissionId);
    expect(sub?.values.phone).toBe('+919876543210');
  });
});
