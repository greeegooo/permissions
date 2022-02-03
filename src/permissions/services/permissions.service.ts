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
    const fields = [];
    request.fields.forEach((field) => {
      const accessKeys = field.access_key.split(',');
      accessKeys.forEach((key) => {
          let propName = key ? `${field.property}.${key}` : field.property;
          fields.push(propName);
      });
    });

    const baseModel = await this.connection.collection('models').findOne({}, { projection: {'_id':0}});
    this.setPropsToTrue(baseModel, fields);

    const initiative = {
      initiative: request.initiative,
      fields: baseModel,
    };

    this.connection.collection('permissions').insertOne(initiative);
  }

  private setPropsToTrue(node: any, requestProps: string[]) {

    console.log(`Node: ${JSON.stringify(node)}. requestProps: ${requestProps}`);

    requestProps.forEach((reqProp) => {

      console.log(`requestProp: ${reqProp}`);

      const propsNames = reqProp.split('.');
      const isNested = propsNames.length > 1;
      const [head, ...tail] = propsNames;
      console.log(`requestProp head: ${head}`);
      let value = node[head];

      if (!!value) {
        if (isNested && reqProp) {
          this.setPropsToTrue(value, [tail.join('.')]);
        } 
        else {
          node[head] = true;
        }
      } 
      else {
        if(isNested) {
            value = node[head] = {};
            this.setPropsToTrue(value, [tail.join('.')]);
        }
        else {
            console.log(`HasNotValue. Value: ${JSON.stringify(value)}.`);
            node[head] = true;
        }
      }
    });
  }
}
