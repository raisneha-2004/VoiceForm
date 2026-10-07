import PDFDocument from 'pdfkit';
import type { IFormSubmissionDocument } from '../models/submission.model.js';
import type { IFormTemplateDocument } from '../models/template.model.js';

export class PdfService {
  static generateSubmissionPdf(
    submission: IFormSubmissionDocument,
    template: IFormTemplateDocument,
    user?: { name: string; email: string }
  ): PDFKit.PDFDocument {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      info: {
        Title: `${template.title} - Submission Report`,
        Author: 'VoiceForm Platform',
        Subject: `Form Submission ID: ${submission._id}`
      }
    });

    // Brand Palette
    const primaryColor = '#4338CA'; // Indigo 700
    const darkSlate = '#0F172A';
    const subtleSlate = '#64748B';
    const lightBg = '#F8FAFC';
    const borderSlate = '#E2E8F0';

    // Header Background
    doc
      .rect(40, 40, 515, 65)
      .fill(primaryColor);

    doc
      .fillColor('#FFFFFF')
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('VoiceForm', 55, 55);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#E0E7FF')
      .text('AI-Powered Multilingual Form Platform', 55, 80);

    const statusText = (submission.status || 'DRAFT').toUpperCase();
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#FFFFFF')
      .text(`Status: ${statusText}`, 420, 65, { align: 'right' });

    doc.moveDown(3);

    // Form Details Section
    let currentY = 125;
    doc
      .fillColor(darkSlate)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text(template.title, 40, currentY);

    currentY += 22;
    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(subtleSlate)
      .text(template.description, 40, currentY, { width: 515 });

    currentY += 30;

    // Metadata Grid
    doc.rect(40, currentY, 515, 45).fill(lightBg).stroke(borderSlate);

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fillColor(subtleSlate)
      .text('SUBMISSION ID', 50, currentY + 8)
      .text('APPLICANT', 200, currentY + 8)
      .text('SUBMISSION DATE', 350, currentY + 8);

    const applicant = user ? `${user.name} (${user.email})` : 'Anonymous / Guest';
    const submissionDate = submission.submittedAt
      ? new Date(submission.submittedAt).toLocaleString()
      : new Date(submission.updatedAt).toLocaleString();

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor(darkSlate)
      .text(submission._id.toString(), 50, currentY + 22)
      .text(applicant, 200, currentY + 22, { width: 140, ellipsis: true })
      .text(submissionDate, 350, currentY + 22);

    currentY += 60;

    // Table Header
    doc
      .rect(40, currentY, 515, 24)
      .fill('#EEF2F6');

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor(darkSlate)
      .text('FIELD NAME', 50, currentY + 7)
      .text('TYPE', 220, currentY + 7)
      .text('RESPONSE / VALUE', 320, currentY + 7);

    currentY += 24;

    const values = submission.values || {};

    // Rows
    for (let i = 0; i < template.fields.length; i++) {
      const field = template.fields[i];
      const rawVal = values[field.key];
      let displayVal = '—';

      if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
        if (typeof rawVal === 'boolean') {
          displayVal = rawVal ? 'Yes / Agreed' : 'No';
        } else if (Array.isArray(rawVal)) {
          displayVal = rawVal.join(', ');
        } else {
          displayVal = String(rawVal);
        }
      }

      // Check for page break
      if (currentY > 730) {
        doc.addPage();
        currentY = 40;
      }

      const rowBg = i % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
      doc.rect(40, currentY, 515, 28).fill(rowBg).stroke(borderSlate);

      doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .fillColor(darkSlate)
        .text(field.label, 50, currentY + 8, { width: 160, ellipsis: true });

      doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor(subtleSlate)
        .text(field.type.toUpperCase(), 220, currentY + 9);

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#1E293B')
        .text(displayVal, 320, currentY + 8, { width: 220, ellipsis: true });

      currentY += 28;
    }

    // Completion percentage & voice metrics block
    if (currentY > 680) {
      doc.addPage();
      currentY = 40;
    } else {
      currentY += 20;
    }

    doc
      .rect(40, currentY, 515, 40)
      .fill('#F0FDF4')
      .stroke('#BBF7D0');

    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#15803D')
      .text(
        `Completion Rate: ${submission.completionPercentage}% | Voice Commands Used: ${submission.voiceMetrics?.commandsUsed || 0} | Voice Corrections: ${submission.voiceMetrics?.correctionsCount || 0}`,
        55,
        currentY + 14
      );

    // Footer
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor(subtleSlate)
      .text(
        `Generated by VoiceForm Platform on ${new Date().toUTCString()} | Verified Document`,
        40,
        780,
        { align: 'center', width: 515 }
      );

    return doc;
  }
}
