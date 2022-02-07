import { OperationType } from "../dtos/operation.enum";
import { PutPermissionsFieldDto } from "../dtos/put.permission.field.dto";

type operationFunc = (node: any, head: string) => void;

const allowOp = (node: any, head: string) => { node[head] = true; }
const denyOp = (node: any, head: string) => { node[head] = false; }
const removeOp = (node: any, head: string) => { delete node[head]; }

const getOperation = (operationType: OperationType): operationFunc => {
    let operation = undefined;
    switch (operationType) {
        case OperationType.DENY: 
          operation = denyOp; 
          break;
        case OperationType.REMOVE: 
          operation = removeOp; 
          break;
        case OperationType.ALLOW: 
        default: operation = allowOp; 
          break;
      }
      return operation;
}
 
const executeOperationInNode = (prop: string, node: any, operation: operationFunc) => {
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
        .forEach(prop => executeOperationInNode(prop, currentFields, getOperation(field.operation)));
    });
}

