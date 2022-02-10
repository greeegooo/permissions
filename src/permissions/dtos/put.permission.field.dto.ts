import { IsEnum, IsOptional, IsString, Matches } from '@nestjs/class-validator';
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
  @Matches(
    new RegExp('^[a-z][a-z_.]'), 
    { message: "property does not follow one of these rules: Characters allowed: lower letters, underscore and periods. Must start with a letter. Nested properties must be separated by a periods. Property name can be separated with underscores."}
  )
  @ApiProperty({
    description: 'Property name',
  })
  property: string;

  @IsString()
  @Matches(
    new RegExp('^[a-z][a-z_,]'), 
    { message: "access_key does not follow one of these rules: Characters allowed: lower letters, underscore and commas. Must start with a letter. Property fields must be separated by a comma. Field name can be separated with underscores."}
  )
  @ApiProperty({
    description: 'Property fields to give access',
  })
  access_key: string;
}
