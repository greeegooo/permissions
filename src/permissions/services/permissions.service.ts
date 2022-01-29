import { Injectable } from "@nestjs/common";
import { PutPermissionsDto } from "../dtos/put.permission.dto";

@Injectable()
export class PermissionsService {

    private permissions: PutPermissionsDto[] = [];

    async get() {
        let field = this.permissions[0].fields[0];
        let propName = field.property;
        let propFields = field.access_key.split(',');

        const PropConstructor = this.createConstructor(...propFields);
        let field1 = new PropConstructor(true, true, true)

        const FieldsConstructor = this.createConstructor(propName);
        let fields = new FieldsConstructor(field1);
        // console.log('propName: ' + propName);
        // console.log('propFields: ', propFields);

        return {
            initiative: "",
            fields
        };
    }

    async put(request: PutPermissionsDto) {

        this.permissions.push(request);
    }

    private createConstructor(...fieldNames) {
        return class {
            constructor(...fieldValues) {
                fieldNames.forEach((name, idx) => {
                    this[name] = fieldValues[idx]
                });
            }
        }
    }
}