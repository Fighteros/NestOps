import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { UploadService } from '../services/upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get('presign')
  async getPresigned(@Query('filename') filename: string) {
    if (!filename) throw new BadRequestException('filename required');
    return this.uploadService.generatePresignedUrl(filename);
  }

  @Post('local')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLocal(
    @Query('token') token: string,
    @Query('sig') sig: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const validated = await this.uploadService.validateToken(token, sig);

    const fullPath = path.join(process.cwd(), validated.filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(fullPath, file.buffer);

    return { success: true, path: validated.filePath };
  }
}
