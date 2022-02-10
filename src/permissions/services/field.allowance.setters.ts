import { OperationType } from "../dtos/operation.enum";
import { PutPermissionsFieldDto } from "../dtos/put.permission.field.dto";

type OperationFunc = (node: any, head: string) => void;

const allowOp = (node: any, head: string): void => { node[head] = true; }
const denyOp = (node: any, head: string): void => { node[head] = false; }
const removeOp = (node: any, head: string): void => { delete node[head]; }

const operations = new Map<OperationType, OperationFunc>(
  [
    [OperationType.ALLOW, allowOp],
    [OperationType.DENY, denyOp],
    [OperationType.REMOVE, removeOp]
  ]
);
 
const executeOperationInNode = (prop: string, node: any, operation: OperationFunc) => {
    const [head, ...tail] = prop.split('.');
    if(tail.length > 0) {
        if(!node[head] || node[head] === true) node[head] = {};
        executeOperationInNode(tail.join('.'), node[head], operation);
    }
    else {
        operation(node, head);
    }
}

export const updatePermissionFields = (requestFields: PutPermissionsFieldDto[], currentFields: any) => {
    requestFields.forEach((field) => {
      field.access_key.split(',')
        .map(key => key ? `${field.property}.${key}` : field.property)
        .forEach(prop => executeOperationInNode(prop, currentFields, operations.get(field.operation)));
    });
}

