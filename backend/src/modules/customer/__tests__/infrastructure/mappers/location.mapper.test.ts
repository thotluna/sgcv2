import { LocationMapper } from '@customer/infrastructure/mappers/location.mapper';

describe('LocationMapper', () => {
  describe('toEntity', () => {
    it('should map model to entity', () => {
      const model: any = {
        id: '1',
        customerId: 'cust-1',
        subCustomerId: null,
        name: 'Office',
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const entity = LocationMapper.toEntity(model);

      expect(entity.id).toBe('1');
      expect(entity.customerId).toBe('cust-1');
      expect(entity.name).toBe('Office');
    });
  });

  describe('toDto', () => {
    it('should map entity to dto', () => {
      const entity: any = {
        id: '1',
        customerId: 'cust-1',
        subCustomerId: 'sub-1',
        name: 'Office',
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = LocationMapper.toDto(entity);

      expect(dto.id).toBe('1');
      expect(dto.subCustomerId).toBe('sub-1');
      expect(dto.name).toBe('Office');
    });
  });

  describe('toCreateInput', () => {
    it('should map dto to input', () => {
      const dto = { name: 'Office', address: '123 Main St', subCustomerId: null };
      const input = LocationMapper.toCreateInput(dto as any, 'cust-1');

      expect(input.customerId).toBe('cust-1');
      expect(input.name).toBe('Office');
    });
  });

  describe('toUpdateInput', () => {
    it('should map dto to input', () => {
      const dto = { name: 'New Office' };
      const input = LocationMapper.toUpdateInput(dto as any);
      expect(input.name).toBe('New Office');
    });
  });
});
