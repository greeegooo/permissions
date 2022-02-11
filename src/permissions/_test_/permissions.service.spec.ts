import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { config } from '../../config';
import { PermissionsService } from '../services/permissions.service';
import { FieldUpdater } from '../services/field.updater';
import { MongoModule } from '@tresdoce/nestjs-database';
import { NotFoundException } from '@nestjs/common';
import { PutPermissionsDto } from '../dtos/put.permission.dto';

//Go against a local mongo test db
xdescribe('PermissionsService', () => {
  let service: PermissionsService;

  const testInitiative = {
    initiative: 'test',
    fields: {
      comercial_info: {
        name: {
          company_name: true,
          web: true,
        },
      },
    },
  };

  const putTestInitiativeRequest = {
    initiative: 'test',
    fields: [
      {
        property: 'comercial_info.name',
        access_key: 'company_name,web',
      },
    ],
  } as PutPermissionsDto;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          load: [config],
        }),
        MongoModule,
      ],
      controllers: [],
      providers: [PermissionsService, FieldUpdater],
    }).compile();

    service = app.get<PermissionsService>(PermissionsService);
  });

  describe('get', () => {
    it('should return initiative test', () => {
      service.get('test').then((result) => expect(result).toEqual(testInitiative));
    });
    it('should return NOT FOUND', async () => {
      await expect(service.get('test2')).rejects.toEqual(
        new NotFoundException(`GET. NOT FOUND. Initiative: test2.`),
      );
    });
  });

  describe('put', () => {
    it('should insert a test initative', () => {
      service
        .update(putTestInitiativeRequest)
        .then((result) => expect(result).toEqual(testInitiative));
    });
  });
});
