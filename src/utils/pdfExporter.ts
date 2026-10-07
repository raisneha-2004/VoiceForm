import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FormTemplate, FormSubmission } from '../types';

export function generatePdfDocument(
  template: FormTemplate,
  formValues: Record<string, any>,
  submissionMeta?: Partial<FormSubmission>
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;

  const safeFields = Array.isArray(template.fields) ? template.fields : [];
  const totalFields = safeFields.length;
  
  // Calculate completed & sensitive stats
  let filledCount = 0;
  let sensitiveCount = 0;

  safeFields.forEach((field) => {
    if (field.isSensitive) sensitiveCount++;
    const val = formValues[field.key];
    if (val !== undefined && val !== null && val !== '') {
      if (typeof val === 'boolean' || String(val).trim() !== '') {
        filledCount++;
      }
    }
  });

  const completionPercent = totalFields > 0 ? Math.round((filledCount / totalFields) * 100) : 100;
  const status = (submissionMeta?.status || (completionPercent === 100 ? 'completed' : 'draft')).toLowerCase();
  const isDraft = status === 'draft';
  const subId = submissionMeta?.id || 'SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const dateStr = submissionMeta?.lastUpdated
    ? new Date(submissionMeta.lastUpdated).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

  // ==========================================
  // 1. HEADER WITH SMOOTH GRADIENT & BRANDING
  // ==========================================
  const headerHeight = 32;
  const numSteps = 40;
  const stepWidth = pageWidth / numSteps;

  // Gradient Colors: Indigo (67, 56, 202) -> Violet (124, 58, 237) -> Purple (147, 51, 234)
  for (let i = 0; i < numSteps; i++) {
    const ratio = i / (numSteps - 1);
    const r = Math.round(67 + (124 - 67) * ratio);
    const g = Math.round(56 + (58 - 56) * ratio);
    const b = Math.round(202 + (237 - 202) * ratio);
    doc.setFillColor(r, g, b);
    doc.rect(i * stepWidth, 0, stepWidth + 0.3, headerHeight, 'F');
  }

  // Header bottom accent line (Rose-Cyan highlight)
  doc.setFillColor(167, 139, 250); // Soft Violet-Purple border line
  doc.rect(0, headerHeight, pageWidth, 1.2, 'F');

  // Subtle Header Texture / Vector Pattern (decorative geometric accents)
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.2);
  
  // Decorative concentric arcs in top right
  for (let r = 8; r <= 32; r += 8) {
    doc.ellipse(pageWidth - 8, 4, r, r, 'S');
  }

  // App Logo Container (Top-Left)
  const logoX = marginX;
  const logoY = 6;
  const logoSize = 18;
  
  // Translucent/White rounded logo card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(logoX, logoY, logoSize, logoSize, 3.5, 3.5, 'F');

  // Stylized VoiceForm Soundwave / Mic Icon Monogram inside Logo
  doc.setFillColor(79, 70, 229); // Indigo
  // Sound waves / pill bars inside logo
  doc.roundedRect(logoX + 3.5, logoY + 7, 2, 4, 0.8, 0.8, 'F');
  doc.roundedRect(logoX + 6.5, logoY + 4, 2, 10, 0.8, 0.8, 'F');
  doc.roundedRect(logoX + 9.5, logoY + 6, 2, 6, 0.8, 0.8, 'F');
  doc.roundedRect(logoX + 12.5, logoY + 8, 2, 2.5, 0.8, 0.8, 'F');

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('VoiceForm', logoX + logoSize + 4, 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(224, 231, 255); // Indigo 100
  doc.text('Intelligent Voice & Multilingual Form Data Report', logoX + logoSize + 4, 20);

  // Top-Right Status Badge in Header
  const reportBadgeText = isDraft ? 'DRAFT REPORT' : 'OFFICIAL SUBMISSION';
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  const badgeWidth = doc.getTextWidth(reportBadgeText) + 8;
  const badgeX = pageWidth - marginX - badgeWidth;
  const badgeY = 10;

  // Badge Glass Background
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(badgeX, badgeY, badgeWidth, 6.5, 2, 2, 'F');
  doc.setTextColor(79, 70, 229); // Indigo 600
  doc.text(reportBadgeText, badgeX + 4, badgeY + 4.5);

  let currentY = 40;

  // ==========================================
  // 2. DOCUMENT TITLE & DESCRIPTION
  // ==========================================
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(template.title || 'Form Submission', marginX, currentY);

  currentY += 5;
  if (template.description) {
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // Slate 500
    const descLines = doc.splitTextToSize(template.description, contentWidth);
    doc.text(descLines, marginX, currentY);
    currentY += descLines.length * 4.5;
  } else {
    currentY += 1;
  }

  currentY += 2;

  // ==========================================
  // 3. METADATA CARDS PANEL (Clean Badges)
  // ==========================================
  const metaBoxHeight = 18;
  const metaBoxY = currentY;

  // Meta Container Background
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, metaBoxY, contentWidth, metaBoxHeight, 3, 3, 'FD');

  const colW = contentWidth / 4;

  // 3.1 Submission ID
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('SUBMISSION ID', marginX + 4, metaBoxY + 5.5);

  doc.setFontSize(8.5);
  doc.setFont('courier', 'bold');
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text(subId, marginX + 4, metaBoxY + 12.5);

  // 3.2 Export Date
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184);
  doc.text('EXPORT DATE', marginX + colW + 4, metaBoxY + 5.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(dateStr, marginX + colW + 4, metaBoxY + 12.5);

  // 3.3 Status Badge
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184);
  doc.text('SUBMISSION STATUS', marginX + colW * 2 + 4, metaBoxY + 5.5);

  const statusLabel = isDraft ? 'DRAFT' : 'COMPLETED';
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  const statusBadgeW = doc.getTextWidth(statusLabel) + 6;
  const statusBadgeX = marginX + colW * 2 + 4;
  const statusBadgeY = metaBoxY + 8;

  if (isDraft) {
    // Amber/Yellow Badge
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.setDrawColor(253, 230, 138); // Amber 200
    doc.roundedRect(statusBadgeX, statusBadgeY, statusBadgeW, 5.5, 1.5, 1.5, 'FD');
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text(statusLabel, statusBadgeX + 3, statusBadgeY + 3.8);
  } else {
    // Emerald Green Badge
    doc.setFillColor(209, 250, 229); // Emerald 100
    doc.setDrawColor(167, 243, 208); // Emerald 200
    doc.roundedRect(statusBadgeX, statusBadgeY, statusBadgeW, 5.5, 1.5, 1.5, 'FD');
    doc.setTextColor(5, 150, 105); // Emerald 600
    doc.text(statusLabel, statusBadgeX + 3, statusBadgeY + 3.8);
  }

  // 3.4 Data Classification / Privacy Badge
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184);
  doc.text('DATA CLASSIFICATION', marginX + colW * 3 + 4, metaBoxY + 5.5);

  const classLabel = sensitiveCount > 0 ? 'RESTRICTED / PII' : 'STANDARD';
  const classBadgeW = doc.getTextWidth(classLabel) + 6;
  const classBadgeX = marginX + colW * 3 + 4;
  const classBadgeY = metaBoxY + 8;

  if (sensitiveCount > 0) {
    doc.setFillColor(254, 226, 226); // Rose 100
    doc.setDrawColor(254, 202, 202); // Rose 200
    doc.roundedRect(classBadgeX, classBadgeY, classBadgeW, 5.5, 1.5, 1.5, 'FD');
    doc.setTextColor(185, 28, 28); // Rose 700
    doc.text(classLabel, classBadgeX + 3, classBadgeY + 3.8);
  } else {
    doc.setFillColor(241, 245, 249); // Slate 100
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.roundedRect(classBadgeX, classBadgeY, classBadgeW, 5.5, 1.5, 1.5, 'FD');
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.text(classLabel, classBadgeX + 3, classBadgeY + 3.8);
  }

  currentY = metaBoxY + metaBoxHeight + 4;

  // ==========================================
  // 4. SUMMARY METRIC TILES
  // ==========================================
  const summaryTileHeight = 13;
  const tileGap = 3;
  const tileWidth = (contentWidth - tileGap * 3) / 4;

  // Tile 1: Total Fields
  drawMetricCard(
    doc,
    marginX,
    currentY,
    tileWidth,
    summaryTileHeight,
    'TOTAL FIELDS',
    `${totalFields}`,
    [79, 70, 229]
  );

  // Tile 2: Completed Fields
  drawMetricCard(
    doc,
    marginX + (tileWidth + tileGap),
    currentY,
    tileWidth,
    summaryTileHeight,
    'COMPLETED',
    `${filledCount} of ${totalFields}`,
    [16, 185, 129]
  );

  // Tile 3: Completion Rate
  drawMetricCard(
    doc,
    marginX + (tileWidth + tileGap) * 2,
    currentY,
    tileWidth,
    summaryTileHeight,
    'COMPLETION RATE',
    `${completionPercent}%`,
    completionPercent === 100 ? [16, 185, 129] : [245, 158, 11]
  );

  // Tile 4: Sensitive Fields
  drawMetricCard(
    doc,
    marginX + (tileWidth + tileGap) * 3,
    currentY,
    tileWidth,
    summaryTileHeight,
    'SENSITIVE / PII',
    `${sensitiveCount} fields`,
    sensitiveCount > 0 ? [239, 68, 68] : [100, 116, 139]
  );

  currentY += summaryTileHeight + 5;

  // ==========================================
  // 5. DATA TABLE (autoTable)
  // ==========================================
  const tableRows = safeFields.map((field, idx) => {
    const rawVal = formValues[field.key];
    let displayVal = '— Not Provided —';

    if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
      if (typeof rawVal === 'boolean') {
        displayVal = rawVal ? 'Yes (Confirmed)' : 'No';
      } else if (field.options && field.type === 'select') {
        const match = field.options.find((o) => o.value === rawVal);
        displayVal = match ? match.label : String(rawVal);
      } else if (Array.isArray(rawVal)) {
        displayVal = rawVal.join(', ');
      } else {
        displayVal = String(rawVal);
      }
    }

    return [
      String(idx + 1),
      field.label || field.key,
      displayVal,
      field.isSensitive ? 'Sensitive' : 'Standard'
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'FIELD NAME', 'RECORDED VALUE', 'CLASSIFICATION']],
    body: tableRows,
    margin: { left: marginX, right: marginX, bottom: 20 },
    theme: 'plain',
    headStyles: {
      fillColor: [67, 56, 202], // Deep Indigo
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 }
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: { top: 4.5, bottom: 4.5, left: 4, right: 4 },
      lineColor: [241, 245, 249],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Subtle light slate striping
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', textColor: [148, 163, 184] },
      1: { cellWidth: 52, fontStyle: 'bold', textColor: [30, 41, 59] },
      2: { cellWidth: 86, textColor: [51, 65, 85] },
      3: { cellWidth: 34, halign: 'center' }
    },
    didDrawCell: (data) => {
      // Custom Badge renderer for 'Classification' column (column index 3) in the body
      if (data.section === 'body' && data.column.index === 3) {
        const isSensitive = data.cell.raw === 'Sensitive';
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellW = data.cell.width;
        const cellH = data.cell.height;

        const badgeW = isSensitive ? 24 : 18;
        const badgeH = 5.5;
        const badgePosX = cellX + (cellW - badgeW) / 2;
        const badgePosY = cellY + (cellH - badgeH) / 2;

        if (isSensitive) {
          // Sensitive Red/Amber Badge
          doc.setFillColor(254, 226, 226); // Red 100
          doc.setDrawColor(254, 202, 202);
          doc.setLineWidth(0.2);
          doc.roundedRect(badgePosX, badgePosY, badgeW, badgeH, 1.5, 1.5, 'FD');

          // Small Lock Dot
          doc.setFillColor(220, 38, 38);
          doc.circle(badgePosX + 3.2, badgePosY + 2.75, 0.8, 'F');

          doc.setFontSize(6.5);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(185, 28, 28); // Red 700
          doc.text('Sensitive', badgePosX + 5.5, badgePosY + 3.8);
        } else {
          // Standard Gray Badge
          doc.setFillColor(241, 245, 249); // Slate 100
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.2);
          doc.roundedRect(badgePosX, badgePosY, badgeW, badgeH, 1.5, 1.5, 'FD');

          doc.setFontSize(6.5);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105); // Slate 600
          doc.text('Standard', badgePosX + 3.5, badgePosY + 3.8);
        }
      }

      // Dim placeholder style for empty values in column 2
      if (data.section === 'body' && data.column.index === 2) {
        if (data.cell.raw === '— Not Provided —') {
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(148, 163, 184);
        }
      }
    }
  });

  // ==========================================
  // 6. MULTI-PAGE FOOTER & CONFIDENTIALITY
  // ==========================================
  const totalPages = (doc as any).internal.getNumberOfPages();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);

    const footerY = pageHeight - 12;

    // Divider line
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.3);
    doc.line(marginX, footerY - 4, pageWidth - marginX, footerY - 4);

    // Left Branding
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(
      `Generated by VoiceForm Platform • ${dateStr}`,
      marginX,
      footerY
    );

    // Confidentiality Notice if document contains sensitive fields
    if (sensitiveCount > 0) {
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(185, 28, 28); // Rose 700
      doc.text(
        'CONFIDENTIAL: Contains sensitive personal information.',
        pageWidth / 2,
        footerY,
        { align: 'center' }
      );
    }

    // Right Page Number
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Page ${p} of ${totalPages}`,
      pageWidth - marginX,
      footerY,
      { align: 'right' }
    );
  }

  return doc;
}

export function exportFormToPdf(
  template: FormTemplate,
  formValues: Record<string, any>,
  submissionMeta?: Partial<FormSubmission>
) {
  const doc = generatePdfDocument(template, formValues, submissionMeta);
  const subId = submissionMeta?.id || 'SUB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const sanitizedTitle = (template.title || 'form_submission')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_');
  doc.save(`${sanitizedTitle}_${subId}.pdf`);
}

export function generatePdfBlobUrl(
  template: FormTemplate,
  formValues: Record<string, any>,
  submissionMeta?: Partial<FormSubmission>
): string {
  const doc = generatePdfDocument(template, formValues, submissionMeta);
  return doc.output('bloburl').toString();
}

/**
 * Helper to render mini stat/metric cards
 */
function drawMetricCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  accentColor: [number, number, number]
) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, w, h, 2, 2, 'FD');

  // Left accent pill
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(x, y, 1.2, h, 0.5, 0.5, 'F');

  // Label
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(label, x + 3.5, y + 4.5);

  // Value
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text(value, x + 3.5, y + 10);
}
