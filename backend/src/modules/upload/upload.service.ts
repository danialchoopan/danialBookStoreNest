/**
 * Upload Service - Local file upload for book images
 *
 * Saves uploaded files to backend/uploads/books/
 * Returns the public URL path for the frontend to use.
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads', 'books');

  constructor() {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadBookImage(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    if (!file) {
      throw new BadRequestException('فایلی ارسال نشد');
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('فرمت فایل پشتیبانی نمی‌شود (فقط JPG, PNG, WebP, GIF)');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('حجم فایل نباید بیشتر از ۵ مگابایت باشد');
    }

    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return {
      url: `/uploads/books/${filename}`,
      filename,
    };
  }

  async uploadMultiple(files: Express.Multer.File[]): Promise<{ url: string; filename: string }[]> {
    const results: { url: string; filename: string }[] = [];
    for (const file of files) {
      const result = await this.uploadBookImage(file);
      results.push(result);
    }
    return results;
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
}
