import { CustomerState } from '@customer/domain/customer.entity';
import { CustomerMapper } from '@customer/infrastructure/mappers/customer.mapper';

import { CustomerState as SharedCustomerState } from '@sgcv2/shared';

describe('CustomerMapper', () => {
  describe('toDto', () => {
    it('should map entity to dto', () => {
      const entity: any = {
        id: '1',
        code: 'C001',
        businessName: 'Business',
        legalName: 'Legal',
        taxId: 'J-123',
        address: 'Addr',
        phone: '123',
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = CustomerMapper.toDto(entity);

      expect(dto.id).toBe('1');
      expect(dto.state).toBe(SharedCustomerState.ACTIVE);
    });

    it('should handle null optional fields', () => {
      const entity: any = {
        id: '1',
        code: 'C001',
        businessName: null,
        legalName: 'Legal',
        taxId: 'J-123',
        address: null,
        phone: null,
        state: CustomerState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = CustomerMapper.toDto(entity);

      expect(dto.businessName).toBeUndefined();
      expect(dto.address).toBe('');
      expect(dto.phone).toBeUndefined();
    });
  });

  describe('toCreateInput', () => {
    it('should map create dto to input', () => {
      const dto = {
        code: 'C001',
        businessName: 'Business',
        legalName: 'Legal',
        taxId: 'J-123',
        address: 'Addr',
        phone: '123',
      };

      const input = CustomerMapper.toCreateInput(dto as any);

      expect(input.code).toBe('C001');
      expect(input.businessName).toBe('Business');
    });

    it('should throw if businessName is missing', () => {
      const dto = { code: 'C1' };
      expect(() => CustomerMapper.toCreateInput(dto as any)).toThrow('businessName is required');
    });
  });

  describe('toUpdateInput', () => {
    it('should map update dto to input', () => {
      const dto = { businessName: 'Updated', state: SharedCustomerState.INACTIVE };
      const input = CustomerMapper.toUpdateInput(dto as any);
      expect(input.businessName).toBe('Updated');
      expect(input.state).toBe(CustomerState.INACTIVE);
    });
  });
});
