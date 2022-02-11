import { OperationType } from '../../dtos/operation.enum';
import { PutPermissionsDto } from '../../dtos/put.permission.dto';
import { PutPermissionsFieldDto } from '../../dtos/put.permission.field.dto';

export const removeRequest: PutPermissionsDto = {
  initiative: 'risk',
  fields: [
    {
      operation: OperationType.REMOVE,
      property: 'comercial_info',
      access_key: '',
    } as PutPermissionsFieldDto,
  ],
};
