'use strict';

import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';

export class EmailPDFService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    generatePDF({ title, entityName, data, fields }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        const records = Array.isArray(data) ? data : [data];
        const generatedAt = new Date().toLocaleString('es-GT', { timeZone: 'America/Guatemala' });

        doc.rect(0, 0, doc.page.width, 80)
            .fill('#1F2D3D');

        doc.fillColor('#FFFFFF')
            .fontSize(22)
            .font('Helvetica-Bold')
            .text('BIBLIOTECA APP', 50, 30);

        doc.fontSize(11)
            .font('Helvetica')
            .fillColor('#D5DBDB')
            .text('Reporte Oficial del Sistema', 50, 55);

        doc.moveDown(3);

        doc.fillColor('#1F2D3D')
            .fontSize(18)
            .font('Helvetica-Bold')
            .text(title, { align: 'center' });

        doc.moveDown(0.5);

        doc.fillColor('#7B7D7D')
            .fontSize(10)
            .text(`Generado el ${generatedAt}`, { align: 'center' });

        doc.moveDown(1.5);

        const summaryTop = doc.y;

        doc.roundedRect(50, summaryTop, 495, 60, 8)
            .fill('#F4F6F7');

        doc.fillColor('#2C3E50')
            .fontSize(11)
            .font('Helvetica-Bold')
            .text('Entidad:', 70, summaryTop + 15);

        doc.font('Helvetica')
            .text(entityName, 150, summaryTop + 15);

        doc.font('Helvetica-Bold')
            .text('Total de registros:', 70, summaryTop + 35);

        doc.font('Helvetica')
            .text(String(records.length), 190, summaryTop + 35);

        doc.moveDown(4);

        records.forEach((record, index) => {

            const obj = record.toObject ? record.toObject() : record;

            const boxTop = doc.y;

            doc.roundedRect(50, boxTop, 495, 25, 6)
                .fill('#2C3E50');

            doc.fillColor('#FFFFFF')
                .fontSize(11)
                .font('Helvetica-Bold')
                .text(`Registro #${index + 1}`, 65, boxTop + 7);

            doc.moveDown(1.5);

            fields.forEach((field, fi) => {

                const value = this._resolveValue(obj, field.key);

                const rowY = doc.y;
                const bgColor = fi % 2 === 0 ? '#FAFAFA' : '#FFFFFF';

                doc.rect(50, rowY, 495, 20)
                    .fill(bgColor);

                doc.fillColor('#34495E')
                    .fontSize(10)
                    .font('Helvetica-Bold')
                    .text(field.label, 65, rowY + 5, { width: 180 });

                doc.fillColor('#000000')
                    .font('Helvetica')
                    .text(String(value ?? 'N/A'), 250, rowY + 5, { width: 280 });

                doc.moveDown(0.5);
            });

            doc.moveDown(1.2);

            if (doc.y > 700 && index < records.length - 1) {
                doc.addPage();
            }
        });

        const pageCount = doc.bufferedPageRange().count;

        for (let i = 0; i < pageCount; i++) {
            doc.switchToPage(i);

            doc.fontSize(8)
                .fillColor('#A6ACAF')
                .text(
                    `Documento generado automáticamente por BibliotecaApp | Página ${i + 1} de ${pageCount}`,
                    50,
                    doc.page.height - 40,
                    { align: 'center' }
                );
        }

        doc.end();
    });
}

    async sendEntityPDF({ toEmail, subject, title, entityName, data, fields, filename }) {
        const pdfBuffer = await this.generatePDF({ title, entityName, data, fields });

        const pdfFilename = filename || `${entityName.toLowerCase()}_reporte.pdf`;

        await this.transporter.sendMail({
            from: `"BibliotecaApp" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject,
            html: `
<div style="background-color:#f4f6f9; padding:40px 0; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <div style="background-color:#2C3E50; padding:20px 30px;">
            <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:600;">
                BibliotecaApp
            </h1>
            <p style="margin:5px 0 0; color:#dcdcdc; font-size:13px;">
                Sistema de Reportes Automatizados
            </p>
        </div>
        <div style="padding:30px; color:#333333;">
            <h2 style="margin-top:0; font-size:18px; color:#2C3E50;">
                ${subject}
            </h2>
            <p style="font-size:14px; line-height:1.6;">
                Estimado usuario,
            </p>
            <p style="font-size:14px; line-height:1.6;">
                Se ha generado correctamente el reporte correspondiente a la entidad 
                <strong>${entityName}</strong>.
            </p>
            <div style="background:#f8f9fb; padding:15px; border-left:4px solid #2C3E50; margin:20px 0;">
                <p style="margin:0; font-size:13px;">
                    <strong>Fecha de generación:</strong><br>
                    ${new Date().toLocaleString('es-GT')}
                </p>
                <p style="margin:8px 0 0; font-size:13px;">
                    <strong>Total de registros incluidos:</strong><br>
                    ${Array.isArray(data) ? data.length : 1}
                </p>
            </div>
            <p style="font-size:14px; line-height:1.6;">
                El documento en formato PDF se encuentra adjunto a este correo.
            </p>
            <div style="margin-top:25px; padding:15px; background:#F4F6F7; border-radius:6px;">
                <p style="margin:0; font-size:13px; color:#2C3E50; font-weight:600;">
                    Soporte / Administrador del Sistema
                </p>
                <p style="margin:5px 0 0; font-size:13px;">
                    Correo de contacto:
                </p>
                <p style="margin:5px 0 0;">
                    <a href="mailto:pdeleon-20213646@kinal.edu.gt" 
                       style="color:#2C3E50; text-decoration:none; font-weight:500;">
                       pdeleon-20213646@kinal.edu.gt
                    </a>
                </p>
            </div>
        </div>
        <div style="background:#f1f1f1; padding:15px 30px; text-align:center;">
            <p style="margin:0; font-size:12px; color:#777777;">
                Este mensaje fue generado automáticamente por el sistema BibliotecaApp.
            </p>
            <p style="margin:5px 0 0; font-size:11px; color:#999999;">
                © ${new Date().getFullYear()} BibliotecaApp. Todos los derechos reservados.
            </p>
        </div>
    </div>
</div>
`,
            attachments: [
                {
                    filename: pdfFilename,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        });

        return { toEmail, filename: pdfFilename, records: Array.isArray(data) ? data.length : 1 };
    }

    _resolveValue(obj, key) {
        return key.split('.').reduce((acc, k) => (acc != null ? acc[k] : null), obj);
    }
}
