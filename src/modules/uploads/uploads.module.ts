import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './controllers/upload.controller';
import { UploadToken } from './domain/entities/upload-token.entity';
import { UploadService } from './services/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([UploadToken])],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadsModule {}
