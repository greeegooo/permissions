import { Module } from '@nestjs/common';
import { PermissionsController } from './controllers/permissions.controller';
import { FieldUpdater } from './services/field.updater';
import { PermissionsService } from './services/permissions.service';

@Module({
  imports: [],
  controllers: [PermissionsController],
  providers: [PermissionsService, FieldUpdater],
})
export class PermissionsModule {}
