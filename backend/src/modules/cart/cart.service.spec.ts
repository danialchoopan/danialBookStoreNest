import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CartService', () => {
  let service: CartService;

  const mockPrisma = {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    book: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const mockBook = { id: 'book1', stock: 10, price: 100000 };
      const mockCart = { id: 'cart1', userId: 'user1' };
      const mockItem = { id: 'item1', cartId: 'cart1', bookId: 'book1', quantity: 1 };

      mockPrisma.book.findUnique.mockResolvedValue(mockBook);
      mockPrisma.cart.upsert.mockResolvedValue(mockCart);
      mockPrisma.cartItem.findUnique.mockResolvedValue(null);
      mockPrisma.cartItem.create.mockResolvedValue(mockItem);
      mockPrisma.cartItem.findMany.mockResolvedValue([{ ...mockItem, book: mockBook }]);
      mockPrisma.cart.findUnique.mockResolvedValue({ ...mockCart, items: [{ ...mockItem, book: mockBook }] });

      const result = await service.addItem('user1', 'book1', 1);

      expect(result).toBeDefined();
      expect(mockPrisma.cartItem.create).toHaveBeenCalled();
    });

    it('should throw if book not found', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null);

      await expect(service.addItem('user1', 'nonexistent', 1)).rejects.toThrow('کتاب یافت نشد');
    });

    it('should throw if insufficient stock', async () => {
      mockPrisma.book.findUnique.mockResolvedValue({ id: 'book1', stock: 2 });

      await expect(service.addItem('user1', 'book1', 5)).rejects.toThrow('موجودی کتاب کافی نیست');
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 'cart1' });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 'item1', cartId: 'cart1' });
      mockPrisma.cartItem.delete.mockResolvedValue({});
      mockPrisma.cartItem.findMany.mockResolvedValue([]);

      const result = await service.removeItem('user1', 'item1');

      expect(result).toBeDefined();
      expect(mockPrisma.cartItem.delete).toHaveBeenCalled();
    });
  });
});
