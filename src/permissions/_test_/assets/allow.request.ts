import { OperationType } from '../../../permissions/dtos/operation.enum';
import { PutPermissionsDto } from '../../dtos/put.permission.dto';
import { PutPermissionsFieldDto } from '../../dtos/put.permission.field.dto';

export const allowRequest: PutPermissionsDto = {
  initiative: 'risk',
  fields: [
    {
      operation: OperationType.ALLOW,
      property: 'comercial_info.name',
      access_key: 'company_name,web',
    } as PutPermissionsFieldDto,
  ],
};
