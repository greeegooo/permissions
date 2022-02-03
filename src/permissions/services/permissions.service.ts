import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Collection, Connection } from 'mongoose';
import { PutPermissionsDto } from '../dtos/put.permission.dto';

@Injectable()
export class PermissionsService {
  private readonly permissions: Collection;

  constructor(@InjectConnection() private connection: Connection) {
    this.permissions = this.connection.collection('permissions');
  }

  async get(initiative: string) {
    return await this.permissions.findOne({ initiative }, { projection: {'_id':0}});
  }

  async getAll() {
    return await this.permissions.find({}, { projection: {'_id':0}}).toArray();
  }

  async put(request: PutPermissionsDto) {
    
    const currentPermissions = await this.getCurrentPermissionsForInitiative(request.initiative);
    
    request.fields.forEach((field) => {
      field.access_key.split(',')
        .map(key => key ? `${field.property}.${key}` : field.property)
        .forEach(prop => this.updatePropInNode(prop, currentPermissions));
    });

    const permission = {
      initiative: request.initiative,
      fields: currentPermissions,
    };

    //TODO: Ver de actualizar o agregar
    this.connection.collection('permissions').insertOne(permission);
  }

  private async getCurrentPermissionsForInitiative(initiative: string): Promise<any> {
    //TODO: Aca buscar si ya existe
    return await this.connection.collection('models').findOne({}, { projection: {'_id':0}});
  }

  private updatePropInNode(prop: string, node: any) {
    const [head, ...tail] = prop.split('.');
    if(tail.length > 0) {
        if(!node[head]) node[head] = {};
        this.updatePropInNode(tail.join('.'), node[head]);
    }
    else {
        node[head] = true;
    }
  }
}
