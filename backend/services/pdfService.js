'use strict';
const PDFDocument = require('pdfkit');

const BRAND_COLOR = '#D4AF37';
const DARK_COLOR  = '#0F172A';

function addHeader(doc, title) {
  doc.rect(0, 0, doc.page.width, 80).fill(DARK_COLOR);
  doc.fillColor(BRAND_COLOR).fontSize(22).font('Helvetica-Bold')
     .text('MANARA-NEXUS', 40, 22);
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica')
     .text('NGO Management System', 40, 50);
  doc.fillColor(BRAND_COLOR).fontSize(14).font('Helvetica-Bold')
     .text(title, 0, 95, { align: 'center' });
  doc.fillColor('#666666').fontSize(9).font('Helvetica')
     .text(`Generated: ${new Date().toLocaleString('en-IN')}`, 0, 115, { align: 'center' });
  doc.moveDown(3);
}

function addFooter(doc) {
  const bottom = doc.page.height - 40;
  doc.moveTo(40, bottom - 10).lineTo(doc.page.width - 40, bottom - 10)
     .strokeColor(BRAND_COLOR).lineWidth(0.5).stroke();
  doc.fillColor('#999').fontSize(8).font('Helvetica')
     .text('Manara-Nexus © 2026 | contact@manara-nexus.org', 40, bottom - 4, { align: 'center' });
}

/**
 * Stream donation receipt as PDF to response
 */
exports.generateReceipt = (donation, res) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=receipt-${donation.receipt_number}.pdf`);
  doc.pipe(res);

  addHeader(doc, 'Donation Receipt');

  // Receipt box
  doc.rect(40, 145, doc.page.width - 80, 180).strokeColor(BRAND_COLOR).lineWidth(1).stroke();

  const left = 60, top = 160, lineH = 22;
  const rows = [
    ['Receipt Number', donation.receipt_number],
    ['Donor Name',     donation.donor_name],
    ['Donor Email',    donation.donor_email],
    ['Campaign',       donation.campaign_title || 'General Donation'],
    ['Amount',         `INR ${parseFloat(donation.amount).toFixed(2)}`],
    ['Payment Mode',   donation.payment_mode],
    ['Status',         donation.status.toUpperCase()],
    ['Date',           new Date(donation.created_at).toLocaleDateString('en-IN')],
  ];

  rows.forEach(([label, value], i) => {
    doc.fillColor('#555').fontSize(9).font('Helvetica').text(label + ':', left, top + i * lineH);
    doc.fillColor(DARK_COLOR).fontSize(9).font('Helvetica-Bold').text(String(value), left + 140, top + i * lineH);
  });

  doc.moveDown(12);
  doc.fillColor('#444').fontSize(9).font('Helvetica')
     .text('Thank you for your generous contribution. Your donation makes a real difference.', { align: 'center' });

  addFooter(doc);
  doc.end();
};

/**
 * Stream a generic table report as PDF
 */
exports.generateReport = (res, title, data, columns) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  doc.pipe(res);

  addHeader(doc, title);

  if (!data.length) {
    doc.fillColor('#888').fontSize(12).text('No data available for this report.', { align: 'center' });
    addFooter(doc);
    doc.end();
    return;
  }

  // Column widths
  const pageW    = doc.page.width - 80;
  const colW     = Math.floor(pageW / columns.length);
  let   y        = 155;
  const rowH     = 20;

  // Header row
  doc.rect(40, y, pageW, rowH).fill(DARK_COLOR);
  columns.forEach((col, i) => {
    doc.fillColor(BRAND_COLOR).fontSize(8).font('Helvetica-Bold')
       .text(col.replace(/_/g, ' ').toUpperCase(), 40 + i * colW + 4, y + 6, { width: colW - 8 });
  });
  y += rowH;

  // Data rows
  data.forEach((row, ri) => {
    if (y > doc.page.height - 60) {
      doc.addPage({ layout: 'landscape' });
      y = 40;
    }
    const bg = ri % 2 === 0 ? '#f9f9f9' : '#ffffff';
    doc.rect(40, y, pageW, rowH).fill(bg);
    columns.forEach((col, i) => {
      const val = row[col] !== null && row[col] !== undefined ? String(row[col]) : '-';
      doc.fillColor('#333').fontSize(7.5).font('Helvetica')
         .text(val, 40 + i * colW + 4, y + 6, { width: colW - 8, ellipsis: true });
    });
    y += rowH;
  });

  addFooter(doc);
  doc.end();
};
