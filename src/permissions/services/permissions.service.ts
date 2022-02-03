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
    return await this.permissions.findOne({ initiative });
  }

  async getAll() {
    return await this.permissions.find({}).toArray();
  }

  async put(request: PutPermissionsDto) {
    const fields = [];
    request.fields.forEach((field) => {
      const accessKeys = field.access_key.split(',');
      accessKeys.forEach((key) => fields.push(`${field.property}.${key}`));
    });

    const baseModel = (await this.connection.collection('models').find().toArray())[0];
    this.setPropsToTrue(baseModel, fields);

    const initiative = {
      initiative: request.initiative,
      fields: baseModel,
    };

    this.connection.collection('permissions').insertOne(initiative);
  }

  private setPropsToTrue(permissions: any, requestProps: string[]) {
    console.log(`PermissionsObject: ${JSON.stringify(permissions)}. RequestProps: ${requestProps}`);

    requestProps.forEach((reqProp) => {
      const propsNames = reqProp.split('.');
      const isNested = propsNames.length > 1;

      const prop = propsNames[0];
      let value = permissions[prop];
      if (!!value) {
        if (isNested) {
          console.log(`HasValue. IsNested. Prop: ${prop}. Value: ${value}`);

          const tail = propsNames.slice(1).join('.');
          console.log(`Tail: ${tail}`);
          this.setPropsToTrue(value, [tail]);
        } else {
          console.log(`HasValue. NotNested. Prop: ${prop}. Value: ${JSON.stringify(value)}`);
          // Object.assign(value, true);
          value = true;
          console.log(`HasValue. NotNested. Prop: ${prop}. Value: ${JSON.stringify(value)}`);
        }
      } else {
        console.log(`Has not value. Prop: ${prop}. Value: ${value}`);
        permissions[prop] = true;
      }
    });
  }
}
