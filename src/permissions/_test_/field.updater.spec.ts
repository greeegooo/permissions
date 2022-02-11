import { getResponse } from './assets/get.response.';
import { FieldUpdater } from '../services/field.updater';
import { putRequest } from './assets/put.request';
import { allowRequest } from './assets/allow.request';
import { denyRequest } from './assets/deny.request';
import { denyResponse } from './assets/deny.response';
import { removeResponse } from './assets/remove.response';
import { removeRequest } from './assets/remove.request';

describe('FieldUpdater', () => {
  const fieldUpdater = new FieldUpdater();

  describe('update', () => {
    it('with no operation should add and allow fields', () => {
      const currentFields = {};
      fieldUpdater.update(putRequest.fields, currentFields);
      expect(currentFields).toEqual(getResponse.fields);
    });
    it('with ALLOW operation should add and allow fields', () => {
      const currentFields = {};
      fieldUpdater.update(allowRequest.fields, currentFields);
      expect(currentFields).toEqual(getResponse.fields);
    });
    it('with DENY operation should add and deny fields', () => {
      const currentFields = {};
      fieldUpdater.update(denyRequest.fields, currentFields);
      expect(currentFields).toEqual(denyResponse.fields);
    });
    it('with REMOVE operation should remove fields', () => {
      const currentFields = getResponse.fields;
      fieldUpdater.update(removeRequest.fields, currentFields);
      expect(currentFields).toEqual(removeResponse.fields);
    });
  });
});
