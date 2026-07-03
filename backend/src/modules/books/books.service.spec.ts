import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

describe('BooksService', () => {
  let service: BooksService;

  const mockPrisma = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    sellerProfile: {
      findUnique: jest.fn(),
    },
    bookCategory: {
      deleteMany: jest.fn(),
    },
  };

  const mockRedis = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    delPattern: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return books with pagination', async () => {
      const mockBooks = [
        { id: '1', title: 'Test Book', price: 100000, reviews: [{ rating: 5 }] },
      ];
      mockPrisma.book.findMany.mockResolvedValue(mockBooks);
      mockPrisma.book.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.data[0].averageRating).toBe(5);
    });

    it('should use cache when available', async () => {
      const cachedResult = { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
      mockRedis.get.mockResolvedValue(cachedResult);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result).toEqual(cachedResult);
      expect(mockPrisma.book.findMany).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const mockBook = {
        id: '1',
        title: 'Test Book',
        reviews: [{ rating: 5 }, { rating: 4 }],
      };
      mockPrisma.book.findUnique.mockResolvedValue(mockBook);

      const result = await service.findOne('1');

      expect(result.title).toBe('Test Book');
      expect(result.averageRating).toBe(4.5);
    });

    it('should throw NotFoundException for non-existent book', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow('کتاب یافت نشد');
    });
  });
});
