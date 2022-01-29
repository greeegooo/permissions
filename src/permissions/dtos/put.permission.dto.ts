import { Type } from "@nestjs/class-transformer";
import { IsArray, IsString, ValidateNested } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PutPermissionsFieldDto } from "./put.permission.field.dto";

export class PutPermissionsDto {
    @IsString()
    @ApiProperty({
        example: 'risk',
        description: 'The name of the initiative'
    })
    initiative: string;

    @Type(() => PutPermissionsFieldDto)
    @ValidateNested({each:true})
    @ApiProperty({
        description: 'The property and fields you need to give access',
        type: [PutPermissionsFieldDto],
        isArray: true
    })
    fields: PutPermissionsFieldDto[];
}