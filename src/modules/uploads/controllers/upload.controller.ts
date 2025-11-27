import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';
import { UploadService } from '../services/upload.service';

@ApiTags('uploads')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get('presign')
  @ApiOperation({ summary: 'Generate a presigned URL for uploading a file' })
  @ApiQuery({
    name: 'filename',
    required: true,
    description: 'Name of the file to upload',
  })
  @ApiResponse({
    status: 200,
    description: 'Presigned URL generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Filename is required' })
  async getPresigned(@Query('filename') filename: string) {
    if (!filename) throw new BadRequestException('filename required');
    return this.uploadService.generatePresignedUrl(filename);
  }

  @Post('local')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file locally using a token' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiQuery({ name: 'token', required: true, description: 'Upload token' })
  @ApiQuery({ name: 'sig', required: true, description: 'Token signature' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 403, description: 'Invalid token or signature' })
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
