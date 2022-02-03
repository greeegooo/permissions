import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { request } from "express";
import { object } from "joi";
import { Collection, Connection } from "mongoose";
import { PutPermissionsDto } from "../dtos/put.permission.dto";

@Injectable()
export class PermissionsService {

    private readonly permissions: Collection;

    constructor(@InjectConnection() private connection: Connection) {
        this.permissions = this.connection.collection('permissions');
    }

    async get(initiative: string) {
        return await this.permissions.findOne({initiative});
    }

    async getAll() {
        return await this.permissions.find({}).toArray();;
    }

    async put(request: PutPermissionsDto) {

        let fields = [];
        request.fields.forEach(field => {
            let accessKeys = field.access_key.split(',');
            accessKeys.forEach(key => fields.push(`${field.property}.${key}`))
        });

        let baseModel = (await this.connection.collection('models').find().toArray())[0];
        this.setPropsToTrue(baseModel, fields);

        let initiative = {
            initiative: request.initiative,
            fields: baseModel
        };

        this.connection.collection('permissions').insertOne(initiative);
    }

    private setPropsToTrue(permissions: Object, requestProps: string[]) {

        console.log(`PermissionsObject: ${JSON.stringify(permissions)}. RequestProps: ${requestProps}`);

        requestProps.forEach(reqProp => {
            
            let propsNames = reqProp.split('.');
            let isNested = propsNames.length > 1;

            let prop = propsNames[0];
            let value = permissions[prop];
            if(!!value) {
                if(isNested) {
                    console.log(`HasValue. IsNested. Prop: ${prop}. Value: ${value}`);

                    let tail = propsNames.slice(1).join('.');
                    console.log(`Tail: ${tail}`);
                    this.setPropsToTrue(value, [tail]);
                }
                else {
                    console.log(`HasValue. NotNested. Prop: ${prop}. Value: ${JSON.stringify(value)}`);
                    // Object.assign(value, true);
                    value = true;
                    console.log(`HasValue. NotNested. Prop: ${prop}. Value: ${JSON.stringify(value)}`);
                }
            }
            else {
                console.log(`Has not value. Prop: ${prop}. Value: ${value}`);
                permissions[prop] = true;
            }
        });
    }
}