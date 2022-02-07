import { IsEnum, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OperationType } from './operation.enum';

export class PutPermissionsFieldDto {

  @IsEnum(OperationType)
  @IsOptional()
  @ApiProperty({
    example: 'ALLOW | DENY | REMOVE',
    description: 'The operation to perform on the field',
  })
  operation: OperationType;
  
  @IsString()
  @ApiProperty({
    description: 'Property name',
  })
  property: string;

  @IsString()
  @ApiProperty({
    description: 'Property fields to give access',
  })
  access_key: string;
}
