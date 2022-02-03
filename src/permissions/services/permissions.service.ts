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
    
    const baseNode = await this.connection.collection('models').findOne({}, { projection: {'_id':0}});
    
    request.fields.forEach((field) => {
      field.access_key.split(',')
        .map(key => key ? `${field.property}.${key}` : field.property)
        .forEach(prop => this.updatePropInNode(prop, baseNode));
    });

    const permission = {
      initiative: request.initiative,
      fields: baseNode,
    };

    this.connection.collection('permissions').insertOne(permission);
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
