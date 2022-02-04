import { PutPermissionsFieldDto } from "../dtos/put.permission.field.dto";

const updatePermissionFields = (requestFields: PutPermissionsFieldDto[], currentFields: any, state: boolean) => {
    requestFields.forEach((field) => {
      field.access_key.split(',')
        .map(key => key ? `${field.property}.${key}` : field.property)
        .forEach(prop => addOrUpdatePropInNode(prop, currentFields, state));
    });
  }
  
const addOrUpdatePropInNode = (prop: string, node: any, state: boolean) => {
    const [head, ...tail] = prop.split('.');
    if(tail.length > 0) {
        if(!node[head] || node[head] === true) node[head] = {};
        addOrUpdatePropInNode(tail.join('.'), node[head], state);
    }
    else {
        node[head] = state;
    }
}

export const allow = (requestFields: PutPermissionsFieldDto[], currentFields: any) => 
    updatePermissionFields(requestFields, currentFields, true);
    
export const deny = (requestFields: PutPermissionsFieldDto[], currentFields: any) =>
    updatePermissionFields(requestFields, currentFields, false);