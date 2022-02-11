import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import { PutPermissionsDto } from '../dtos/put.permission.dto';
import { FieldUpdater } from './field.updater';

@Injectable()
export class PermissionsService {
  private readonly permissions: Collection;
  private readonly logger = new Logger(PermissionsService.name);

  constructor(
    private readonly fieldUpdater: FieldUpdater,
    @InjectConnection() private connection: Connection,
  ) {
    this.permissions = this.connection.collection('permissions');
  }

  async get(initiative: string): Promise<any> {
    this.logger.log(`GET. Searching for. Initiative: ${initiative}.`);
    const permissions = await this.permissions.findOne({ initiative }, { projection: { _id: 0 } });
    if (!permissions) {
      const message = `GET. NOT FOUND. Initiative: ${initiative}.`;
      this.logger.log(message);
      throw new NotFoundException(message);
    }
    return permissions;
  }

  async getAll(): Promise<any[]> {
    this.logger.log(`GET ALL. Searching.`);
    return await this.permissions.find({}, { projection: { _id: 0 } }).toArray();
  }

  async update(request: PutPermissionsDto): Promise<any> {
    this.logger.log(`UPDATE. Starting. Initiative: ${request.initiative}.`);

    const permission = await this.getPermissionFor(request.initiative);

    this.logger.log(`UPDATE. Starting update process. Initiative: ${request.initiative}.`);
    this.fieldUpdater.update(request.fields, permission.fields);
    this.logger.log(`UPDATE. Finished update process. Initiative: ${request.initiative}.`);

    this.addOrUpdatePermission(permission);

    this.logger.log(`UPDATE. Finished. Initiative: ${request.initiative}.`);

    return permission;
  }

  private async getPermissionFor(initiative: string): Promise<any> {
    this.logger.log(`UPDATE. Looking permission for. Initiative: ${initiative}.`);
    let permission = await this.permissions.findOne({ initiative });
    if (!permission) permission = { _id: null, initiative: '', fields: {} };
    permission.initiative = initiative;
    this.logger.log(
      `UPDATE. Current permission for. Initiative: ${initiative}. Data: ${JSON.stringify(
        permission,
      )}`,
    );
    return permission;
  }

  private addOrUpdatePermission(permission: any) {
    this.logger.log(`UPDATE. Starting update db. Initiative: ${permission.initiative}.`);
    if (permission._id) {
      this.logger.log(`UPDATE. Updating db entity. Initiative: ${permission.initiative}.`);
      this.permissions.updateOne({ _id: permission._id }, { $set: permission });
    } else {
      this.logger.log(`UPDATE. Inserting db entity. Initiative: ${permission.initiative}.`);
      this.permissions.insertOne(permission);
    }
    this.logger.log(`UPDATE. Finished update db. Initiative: ${permission.initiative}.`);
  }
}
