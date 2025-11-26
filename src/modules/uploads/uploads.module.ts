import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadToken } from './domain/entities/upload-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadToken])],
  providers: [],
  exports: [],
})
export class UploadsModule {}
