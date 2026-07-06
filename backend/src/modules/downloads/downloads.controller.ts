import { Controller, Get, Param, UseGuards, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DownloadsService } from './downloads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import * as fs from 'fs';

@ApiTags('دانلود')
@Controller('downloads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DownloadsController {
  constructor(private downloadsService: DownloadsService) {}

  @Get('my-books')
  @ApiOperation({ summary: 'لیست کتاب‌های الکترونیکی خریداری شده' })
  getMyBooks(@CurrentUser('id') userId: string) {
    return this.downloadsService.getMyBooks(userId);
  }

  @Get(':bookId')
  @ApiOperation({ summary: 'دانلود/مشاهده کتاب الکترونیکی' })
  async downloadEbook(
    @CurrentUser('id') userId: string,
    @Param('bookId') bookId: string,
    @Res() res: Response,
  ) {
    const { filePath, title } = await this.downloadsService.getEbookFile(userId, bookId);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${encodeURIComponent(title)}.pdf"`,
      'Cache-Control': 'no-cache',
    });

    fs.createReadStream(filePath).pipe(res);
  }
}
