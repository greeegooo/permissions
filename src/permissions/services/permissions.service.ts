import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import { PutPermissionsDto } from '../dtos/put.permission.dto';
import { updatePermissionFields } from './field.allowance.setters';

@Injectable()
export class PermissionsService {
  private readonly permissions: Collection;
  private readonly models: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    this.permissions = this.connection.collection('permissions');
    this.models = this.connection.collection('models');
  }

  async get(initiative: string) {
    const permissions = await this.permissions.findOne({ initiative }, { projection: {'_id':0}});
    if(!permissions) throw new NotFoundException(`No se encontró la inicitativa: ${initiative}`);
    return permissions;
  }

  async getAll() {
    return await this.permissions.find({}, { projection: {'_id':0}}).toArray();
  }

  async update(request: PutPermissionsDto) {
    let permission = await this.getCurrentPermissionsForInitiative(request.initiative);
    updatePermissionFields(request.fields, permission.fields);
    this.addOrUpdatePermission(permission);
  }

  private async getCurrentPermissionsForInitiative(initiative: string): Promise<any> {
    let permission = await this.permissions.findOne({initiative});
    if(!permission) permission = await this.models.findOne({}, { projection: {'_id':0}});
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
