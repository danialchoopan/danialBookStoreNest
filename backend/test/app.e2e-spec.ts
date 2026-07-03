import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('BookNest API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('/api/auth/register (POST) - should register', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@booknest.ir',
          password: 'test12345',
          firstName: 'تست',
          lastName: 'کاربر',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.user.email).toBe('test@booknest.ir');
          expect(res.body.data.accessToken).toBeDefined();
          authToken = res.body.data.accessToken;
          userId = res.body.data.user.id;
        });
    });

    it('/api/auth/login (POST) - should login', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@booknest.ir', password: 'test12345' })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.accessToken).toBeDefined();
        });
    });

    it('/api/auth/profile (GET) - should get profile with token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.email).toBe('test@booknest.ir');
        });
    });

    it('/api/auth/profile (GET) - should fail without token', () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .expect(401);
    });
  });

  describe('Books', () => {
    it('/api/books (GET) - should list books', () => {
      return request(app.getHttpServer())
        .get('/api/books')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('/api/search/autocomplete?q=بوف (GET) - should autocomplete', () => {
      return request(app.getHttpServer())
        .get('/api/search/autocomplete?q=بوف')
        .expect(200)
        .expect((res) => {
          expect(res.body.books).toBeDefined();
        });
    });
  });

  describe('Cart', () => {
    it('/api/cart (GET) - should get empty cart', () => {
      return request(app.getHttpServer())
        .get('/api/cart')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Wishlist', () => {
    it('/api/wishlist (GET) - should get empty wishlist', () => {
      return request(app.getHttpServer())
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow normal requests', () => {
      return request(app.getHttpServer())
        .get('/api/books')
        .expect(200);
    });
  });
});
