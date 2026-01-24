import { SubCustomerMapper } from '@customer/infrastructure/mappers/subcustomer.mapper';

describe('SubCustomerMapper', () => {
  describe('toEntity', () => {
    it('should map model to entity', () => {
      const model: any = {
        id: '1',
        customerId: 'cust-1',
        businessName: 'Sub',
        externalCode: 'EXT',
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: {
          legalName: 'Legal',
          businessName: 'Main',
        },
      };

      const entity = SubCustomerMapper.toEntity(model);

      expect(entity.id).toBe('1');
      expect(entity.customer?.legalName).toBe('Legal');
    });

    it('should handle missing customer in model', () => {
      const model: any = {
        id: '1',
        customerId: 'cust-1',
        businessName: 'Sub',
        externalCode: 'EXT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const entity = SubCustomerMapper.toEntity(model);

      expect(entity.customer).toBeUndefined();
    });
  });

  describe('toDto', () => {
    it('should map entity to dto', () => {
      const entity: any = {
        id: '1',
        customerId: 'cust-1',
        businessName: 'Sub',
        externalCode: 'EXT',
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: {
          legalName: 'Legal',
        },
      };

      const dto = SubCustomerMapper.toDto(entity);

      expect(dto.id).toBe('1');
      expect(dto.customerName).toBe('Legal');
    });
  });

  describe('toCreateInput', () => {
    it('should map dto to input', () => {
      const dto = { businessName: 'Sub', externalCode: 'EXT' };
      const input = SubCustomerMapper.toCreateInput(dto as any, 'cust-1');

      expect(input.customerId).toBe('cust-1');
      expect(input.businessName).toBe('Sub');
    });
  });

  describe('toUpdateInput', () => {
    it('should map dto to input', () => {
      const dto = { businessName: 'New' };
      const input = SubCustomerMapper.toUpdateInput(dto as any);
      expect(input.businessName).toBe('New');
    });
  });
});
