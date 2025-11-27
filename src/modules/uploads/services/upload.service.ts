import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { UploadToken } from '../domain/entities/upload-token.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadToken)
    private tokenRepo: Repository<UploadToken>,
    private readonly configService: ConfigService,
  ) {}

  async generatePresignedUrl(filename: string) {
    const filePath = `uploads/${Date.now()}-${filename}`;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 2); // 2 minutes

    const token = this.tokenRepo.create({
      filePath,
      expiresAt,
    });

    await this.tokenRepo.save(token);

    const signature = crypto
      .createHmac('sha256', this.configService.get('secrets.uploadSecret')!)
      .update(token.id)
      .digest('hex');

    return {
      uploadUrl: `/upload/local?token=${token.id}&sig=${signature}`,
      filePath,
      expiresAt,
    };
  }

  async validateToken(tokenId: string, sig: string): Promise<UploadToken> {
    const expectedSig = crypto
      .createHmac('sha256', this.configService.get('secrets.uploadSecret')!)
      .update(tokenId)
      .digest('hex');

    if (sig !== expectedSig) {
      throw new UnauthorizedException('Invalid signature');
    }

    const token = await this.tokenRepo.findOneBy({ id: tokenId });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    return token;
  }
}
