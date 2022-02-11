import { Injectable } from '@nestjs/common';
import { OperationType } from '../dtos/operation.enum';
import { PutPermissionsFieldDto } from '../dtos/put.permission.field.dto';

type OperationFunc = (node: any, head: string) => void;

@Injectable()
export class FieldUpdater {
  private readonly allowOp = (node: any, head: string): void => {
    node[head] = true;
  };
  private readonly denyOp = (node: any, head: string): void => {
    node[head] = false;
  };
  private readonly removeOp = (node: any, head: string): void => {
    delete node[head];
  };
  private readonly operations = new Map<OperationType, OperationFunc>([
    [, this.allowOp], //default
    [OperationType.ALLOW, this.allowOp],
    [OperationType.DENY, this.denyOp],
    [OperationType.REMOVE, this.removeOp],
  ]);

  public update = (requestFields: PutPermissionsFieldDto[], currentFields: any) =>
    this.updatePermissionFields(requestFields, currentFields);

  private updatePermissionFields = (
    requestFields: PutPermissionsFieldDto[],
    currentFields: any,
  ) => {
    requestFields.forEach((field) => {
      field.access_key
        .split(',')
        .map((key) => (key ? `${field.property}.${key}` : field.property))
        .forEach((prop) =>
          this.executeOperationInNode(prop, currentFields, this.operations.get(field.operation)),
        );
    });
  };

  private executeOperationInNode = (prop: string, node: any, operation: OperationFunc) => {
    const [head, ...tail] = prop.split('.');
    if (tail.length > 0) {
      if (!node[head] || node[head] === true) node[head] = {};
      this.executeOperationInNode(tail.join('.'), node[head], operation);
    } else {
      operation(node, head);
    }
  };
}
