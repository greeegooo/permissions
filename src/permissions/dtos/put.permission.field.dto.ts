import { IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PutPermissionsFieldDto {
    @IsString()
    @ApiProperty({
        description: 'Property name'
    })
    property: string;

    @IsString()
    @ApiProperty({
        description: 'Property fields to give access'
    })
    access_key: string;
}