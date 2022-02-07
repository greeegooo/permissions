import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PutPermissionsDto } from '../dtos/put.permission.dto';
import { PermissionsService } from '../services/permissions.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiOperation({
    summary: 'Get all initiatives',
  })
  @Get()
  getAll() {
    return this.permissionsService.getAll();
  }

  @ApiOperation({
    summary: 'Get an initiative',
  })
  @Get(':initiative')
  get(@Param('initiative') initiative: string) {
    return this.permissionsService.get(initiative);
  }

  //TODO: Agregar validation pipes
  @ApiOperation({
    summary: 'Creates or allows field permissions for a given initiative.',
  })
  @Put()
  put(@Body() request: PutPermissionsDto) {
    this.permissionsService.update(request);
  }

  @ApiOperation({
    summary: 'Execute specific operation on fields for a given initiative.',
  })
  @Patch()
  patch(
    @Body() request: PutPermissionsDto) {
      this.permissionsService.update(request);
  }
}
