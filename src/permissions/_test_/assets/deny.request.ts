import { OperationType } from '../../dtos/operation.enum';
import { PutPermissionsDto } from '../../dtos/put.permission.dto';
import { PutPermissionsFieldDto } from '../../dtos/put.permission.field.dto';

export const denyRequest: PutPermissionsDto = {
  initiative: 'risk',
  fields: [
    {
      operation: OperationType.DENY,
      property: 'comercial_info.name',
      access_key: 'company_name,web',
    } as PutPermissionsFieldDto,
  ],
};
