import { PutPermissionsDto } from '../../dtos/put.permission.dto';
import { PutPermissionsFieldDto } from '../../dtos/put.permission.field.dto';

export const putRequest: PutPermissionsDto = {
  initiative: 'risk',
  fields: [
    {
      property: 'comercial_info.name',
      access_key: 'company_name,web',
    } as PutPermissionsFieldDto,
  ],
};
