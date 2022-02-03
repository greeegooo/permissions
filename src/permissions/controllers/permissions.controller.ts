import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PutPermissionsDto } from '../dtos/put.permission.dto';
import { PermissionsService } from '../services/permissions.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({
    summary: 'Get all initiatives and permissions',
  })
  @Get()
  getAll() {
    return this.permissionsService.getAll();
  }

  @ApiOperation({
    summary: 'Get all initiatives and permissions',
  })
  @Get(':initiative')
  get(@Param('initiative') initiative: string) {
    return this.permissionsService.get(initiative);
  }

  @ApiOperation({
    summary: 'Creates or updates permissions for a given initiative',
  })
  @Put()
  put(@Body() request: PutPermissionsDto) {
    console.log(JSON.stringify(request));
    this.permissionsService.put(request);
  }
}
