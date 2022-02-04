import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection, ObjectId } from 'mongoose';
import { PutPermissionsDto } from '../dtos/put.permission.dto';
import { PutPermissionsFieldDto } from '../dtos/put.permission.field.dto';

@Injectable()
export class PermissionsService {
  private readonly permissions: Collection;
  private readonly models: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    this.permissions = this.connection.collection('permissions');
    this.models = this.connection.collection('models');
  }

  async get(initiative: string) {
    return await this.permissions.findOne({ initiative }, { projection: {'_id':0}});
  }

  async getAll() {
    return await this.permissions.find({}, { projection: {'_id':0}}).toArray();
  }

  async put(request: PutPermissionsDto) {
    
    const permission = await this.getCurrentPermissionsForInitiative(request.initiative);
    
    this.updatePermissionFields(request.fields, permission.fields);

    this.addOrUpdatePermission(permission);
  }

  private async getCurrentPermissionsForInitiative(initiative: string): Promise<any> {
    let permission = await this.permissions.findOne({initiative});
    if(!permission) permission = await this.models.findOne({}, { projection: {'_id':0}});
    permission.initiative = initiative;
    return permission;
  }

  private updatePermissionFields(requestFields: PutPermissionsFieldDto[], currentFields: any) {
    requestFields.forEach((field) => {
      field.access_key.split(',')
        .map(key => key ? `${field.property}.${key}` : field.property)
        .forEach(prop => this.addOrUpdatePropInNode(prop, currentFields));
    });
  }
  
  private addOrUpdatePropInNode(prop: string, node: any) {
    const [head, ...tail] = prop.split('.');
    if(tail.length > 0) {
        if(!node[head] || node[head] === true) node[head] = {};
        this.addOrUpdatePropInNode(tail.join('.'), node[head]);
    }
    else {
        node[head] = true;
    }
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
