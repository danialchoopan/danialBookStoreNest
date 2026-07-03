import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockPrisma = {
    book: { findUnique: jest.fn() },
    review: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    orderItem: { findFirst: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a review for a buyer', async () => {
      mockPrisma.book.findUnique.mockResolvedValue({ id: 'book1' });
      mockPrisma.orderItem.findFirst.mockResolvedValue({ id: 'oi1' });
      mockPrisma.review.findUnique.mockResolvedValue(null);
      mockPrisma.review.create.mockResolvedValue({ id: 'r1', rating: 5, comment: 'عالی' });

      const result = await service.create('user1', 'book1', { rating: 5, comment: 'عالی' });

      expect(result.rating).toBe(5);
    });

    it('should throw if not a buyer', async () => {
      mockPrisma.book.findUnique.mockResolvedValue({ id: 'book1' });
      mockPrisma.orderItem.findFirst.mockResolvedValue(null);

      await expect(
        service.create('user1', 'book1', { rating: 5 })
      ).rejects.toThrow('فقط خریداران');
    });

    it('should throw if already reviewed', async () => {
      mockPrisma.book.findUnique.mockResolvedValue({ id: 'book1' });
      mockPrisma.orderItem.findFirst.mockResolvedValue({ id: 'oi1' });
      mockPrisma.review.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        service.create('user1', 'book1', { rating: 5 })
      ).rejects.toThrow('قبلاً');
    });
  });
});
