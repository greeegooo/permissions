import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PutPermissionsDto } from "../dtos/put.permission.dto";
import { Permission } from "../entities/permission.schema";
import { PermissionsService } from "../services/permissions.service";

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {

    private permissions: PutPermissionsDto[] = [];

    constructor(private readonly permissionsService: PermissionsService){}

    @ApiOperation({
        summary: 'Get all initiatives and permissions'
    })
    @Get()
    getAll() {
        return this.permissions;
    }

    @ApiOperation({
        summary: 'Get all initiatives and permissions'
    })
    @Get(':initiative')
    get(@Param('initiative') initiative: string) {
        throw new Error("Not implemented");
    }

    @ApiOperation({
        summary: 'Creates or updates permissions for a given initiative'
    })
    @Put()
    put(@Body() request: PutPermissionsDto) {
        console.log(JSON.stringify(request));
        this.permissions.push(request);
    }
}