/**
 * Email Service - In-memory email logging for development
 *
 * In production, replace with Nodemailer/Resend/SendGrid.
 * For now, logs emails to console so you can see what would be sent.
 */

import { Injectable, Logger } from '@nestjs/common';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private emailsSent: EmailOptions[] = [];

  async sendEmail(options: EmailOptions): Promise<void> {
    // In production, replace with actual email sending:
    // await this.transporter.sendMail({ from: 'noreply@booknest.ir', ...options });

    this.emailsSent.push(options);
    this.logger.log(`📧 Email sent to ${options.to}: ${options.subject}`);
  }

  async sendOrderConfirmation(order: {
    id: string;
    email: string;
    firstName: string;
    items: Array<{ title: string; quantity: number; price: number }>;
    totalAmount: number;
  }): Promise<void> {
    const itemsHtml = order.items
      .map((item) => `<tr><td>${item.title}</td><td>${item.quantity}</td><td>${item.price.toLocaleString('fa-IR')} تومان</td></tr>`)
      .join('');

    await this.sendEmail({
      to: order.email,
      subject: `✅ تأیید سفارش ${order.id.slice(0, 8)}`,
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">سفارش شما ثبت شد!</h2>
          <p>سلام ${order.firstName}،</p>
          <p>سفارش شما با موفقیت ثبت شد.</p>
          <p><strong>شماره سفارش:</strong> ${order.id.slice(0, 12)}...</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead><tr style="background: #f1f5f9;"><th style="padding: 8px; text-align: right;">کتاب</th><th style="padding: 8px;">تعداد</th><th style="padding: 8px;">قیمت</th></tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="font-size: 18px;"><strong>مبلغ کل: ${order.totalAmount.toLocaleString('fa-IR')} تومان</strong></p>
          <hr />
          <p style="color: #64748b; font-size: 12px;">کتاب‌نست - فروشگاه آنلاین کتاب</p>
        </div>
      `,
    });
  }

  async sendStatusUpdate(order: {
    id: string;
    email: string;
    firstName: string;
    status: string;
    statusLabel: string;
  }): Promise<void> {
    await this.sendEmail({
      to: order.email,
      subject: `📦 بروزرسانی سفارش ${order.id.slice(0, 8)}`,
      html: `
        <div dir="rtl" style="font-family: Tahoma, Arial; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">وضعیت سفارش بروزرسانی شد</h2>
          <p>سلام ${order.firstName}،</p>
          <p>وضعیت سفارش شما تغییر کرد:</p>
          <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #059669;">${order.statusLabel}</span>
          </div>
          <p><strong>شماره سفارش:</strong> ${order.id.slice(0, 12)}...</p>
          <hr />
          <p style="color: #64748b; font-size: 12px;">کتاب‌نست - فروشگاه آنلاین کتاب</p>
        </div>
      `,
    });
  }

  getSentEmails(): EmailOptions[] {
    return this.emailsSent;
  }
}
