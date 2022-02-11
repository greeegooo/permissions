import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { config } from '../../config';
import { PermissionsController } from '../controllers/permissions.controller';
import { PermissionsService } from '../services/permissions.service';
import { getResponse } from './assets/get.response.';
import { FieldUpdater } from '../services/field.updater';
import { MongoModule } from '@tresdoce/nestjs-database';
import { NotFoundException } from '@nestjs/common';
import { putRequest } from './assets/put.request';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          load: [config],
        }),
        MongoModule,
      ],
      controllers: [PermissionsController],
      providers: [PermissionsService, FieldUpdater],
    }).compile();

    controller = app.get<PermissionsController>(PermissionsController);
    service = app.get<PermissionsService>(PermissionsService);
  });

  describe('get', () => {
    it('should return initiative risk', () => {
      jest.spyOn(service, 'get').mockImplementation(async () => getResponse);
      controller.get('risk').then((result) => expect(result).toBe(getResponse));
    });

    it('should return not found for risk2', async () => {
      jest.spyOn(service, 'get').mockImplementation(async () => {
        throw new NotFoundException(`GET. NOT FOUND. Initiative: risk2.`);
      });

      await expect(controller.get('risk2')).rejects.toEqual(
        new NotFoundException(`GET. NOT FOUND. Initiative: risk2.`),
      );
    });
  });

  describe('getAll', () => {
    it('should return all initiatives', () => {
      jest.spyOn(service, 'getAll').mockImplementation(async () => [getResponse]);
      controller.getAll().then((result) => expect(result.length).toBe(1));
    });

    it('should return empty', () => {
      jest.spyOn(service, 'getAll').mockImplementation(async () => []);
      controller.getAll().then((result) => expect(result.length).toBe(0));
    });
  });

  describe('put', () => {
    it('should return the permission', () => {
      jest.spyOn(service, 'update').mockImplementation(async () => getResponse);
      controller.put(putRequest).then((result) => expect(result).toBe(getResponse));
    });
  });
});
