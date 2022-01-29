import { Module } from '@nestjs/common';
import { MongoModule } from '@tresdoce/nestjs-database';
import { PermissionsController } from './controllers/permissions.controller';
import { Permission, PermissionSchema } from './entities/permission.schema';
import { PermissionsService } from './services/permissions.service';

@Module({
  imports: [],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}