import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { FormTemplate } from '../src/models/template.model.js';
import { FormSubmission } from '../src/models/submission.model.js';
import { SEED_TEMPLATES } from '../src/seeds/seedTemplates.js';

const app = createApp();

describe('PDF Generation Module', () => {
  let userToken: string;
  let submissionId: string;

  beforeEach(async () => {
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Sneha PDF Tester',
      email: 'sneha.pdf@example.com',
      password: 'SecurePassword123!'
    });
    userToken = userRes.body.data.tokens.accessToken;

    const tpl = await FormTemplate.create(SEED_TEMPLATES[0]);

    const sub = await FormSubmission.create({
      userId: userRes.body.data.user.id,
      templateId: tpl._id,
      title: 'Student Registration PDF Test',
      values: {
        fullName: 'Sneha Rai',
        email: 'sneha.rai@example.com',
        phone: '+91 98765 43210',
        dob: '2004-08-15',
        course: 'btech-ai',
        city: 'Noida'
      },
      status: 'submitted',
      completionPercentage: 100
    });
    submissionId = sub._id.toString();
  });

  it('should stream a valid PDF file with application/pdf headers', async () => {
    const res = await request(app)
      .get(`/api/submissions/${submissionId}/pdf`)
      .set('Authorization', `Bearer ${userToken}`)
      .buffer(true)
      .parse((res, callback) => {
        res.setEncoding('binary');
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          callback(null, Buffer.from(data, 'binary'));
        });
      });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toContain('.pdf');

    // PDF files always start with '%PDF-' magic bytes
    const pdfBuffer = res.body as Buffer;
    expect(pdfBuffer.slice(0, 5).toString('ascii')).toBe('%PDF-');
    expect(pdfBuffer.length).toBeGreaterThan(1000);
  });
});
