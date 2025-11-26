import { Base } from '@/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class UploadToken extends Base {
  @Column()
  filePath: string;

  @Column()
  expiresAt: Date;
}
