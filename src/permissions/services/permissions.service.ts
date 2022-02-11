import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import { PutPermissionsDto } from '../dtos/put.permission.dto';
import FieldUpdater from './field.updater';

@Injectable()
export class PermissionsService {
  private readonly permissions: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    this.permissions = this.connection.collection('permissions');
  }

  async get(initiative: string) {
    const permissions = await this.permissions.findOne({ initiative }, { projection: {'_id':0}});
    if(!permissions) throw new NotFoundException(`Initiative: ${initiative} not found.`);
    return permissions;
  }

  async getAll() {
    return await this.permissions.find({}, { projection: {'_id':0}}).toArray();
  }

  async update(request: PutPermissionsDto) {
    let permission = await this.getPermissionFor(request.initiative);
    FieldUpdater.update(request.fields, permission.fields);
    this.addOrUpdatePermission(permission);
  }

  private async getPermissionFor(initiative: string): Promise<any> {
    let permission = await this.permissions.findOne({initiative});
    if(!permission) permission = { _id: null, initiative: '', fields: {}};
    permission.initiative = initiative;
    return permission;
  }

  private addOrUpdatePermission(permission: any) {
    if(permission._id) {
      this.permissions.updateOne({ _id: permission._id }, { $set: permission });
    }
    else {
      this.permissions.insertOne(permission);
    }
  }
}
