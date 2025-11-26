import { ApiProperty } from '@nestjs/swagger';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class GenericResponseDto<T> {
  @ApiProperty({
    description: 'The status code of the response',
    example: 200,
  })
  code: number;

  @ApiProperty({
    type: Object,
    description: 'The response of the request',
    additionalProperties: true,
  })
  response: T;

  @ApiProperty({
    description: 'The timestamp of the response',
    example: new Date().toISOString(),
  })
  timestamp: string;
}
