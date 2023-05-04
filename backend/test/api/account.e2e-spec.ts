import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserEntity } from '@app/domain';
import { hash } from 'bcrypt';
import { clearDb, createTestApp, login } from '../utils';
import * as request from 'supertest';

const MOCK_USER = {
  name: 'max',
  password: 'password',
};

describe('Account (e2e)', () => {
  let app: INestApplication;

  async function insertTestUser() {
    const dataSource = app.get(DataSource);
    const userRepository = dataSource.getRepository(UserEntity);
    const user = userRepository.create({
      name: MOCK_USER.name,
      password: await hash(
        MOCK_USER.password,
        parseInt(process.env.SECURITY_HASH_SALT_OR_ROUNDS!),
      ),
      firstName: 'Maxime',
      lastName: 'Mustermann',
    });
    await userRepository.save(user);
  }

  beforeEach(async () => {
    const result = await createTestApp();
    app = result.app;
  });

  afterEach(async () => {
    await clearDb(app.get(DataSource));
    await app.close();
  });

  it('/login (POST) - success', async () => {
    await insertTestUser();

    const response = await request(app.getHttpServer())
      .post('/account/login')
      .send({
        name: 'max',
        password: 'password',
      })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();
  });

  it('/login (POST) - failure', async () => {
    await insertTestUser();

    const response = await request(app.getHttpServer())
      .post('/account/login')
      .send({
        name: 'max',
        password: 'password1',
      })
      .expect(400);

    expect(response.body.message).toEqual(
      'account/auth/invalid-username-or-password',
    );
  });

  it('/exchange-refresh-token (POST) - success', async () => {
    await insertTestUser();

    const { refreshToken } = await login({
      app,
      name: MOCK_USER.name,
      password: MOCK_USER.password,
    });

    const refreshTokenResponse = await request(app.getHttpServer())
      .post('/account/exchange-refresh-token')
      .send({
        refreshToken: refreshToken,
      })
      .expect(201);

    expect(refreshTokenResponse.body.accessToken).toBeDefined();
    expect(refreshTokenResponse.body.refreshToken).toBeDefined();
  });
});
