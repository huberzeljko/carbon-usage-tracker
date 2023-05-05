import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UsageTypeEntity, UserEntity } from '@app/domain';
import { hash } from 'bcrypt';
import { clearDb, createTestApp, login } from '../utils';
import * as request from 'supertest';

const MOCK_USER = {
  name: 'max',
  password: 'password',
};

describe('Carbon Usage (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  async function insertTestUser() {
    const dataSource = app.get(DataSource);
    const userRepository = dataSource.getRepository(UserEntity);
    const user = userRepository.create({
      id: 1,
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

  async function insertTestUsageType() {
    const dataSource = app.get(DataSource);
    const usageTypeRepository = dataSource.getRepository(UsageTypeEntity);
    const usageType = usageTypeRepository.create({
      id: 1,
      name: 'Fuel',
      unit: 'Galons',
    });
    await usageTypeRepository.save(usageType);
  }

  beforeEach(async () => {
    const result = await createTestApp();
    app = result.app;

    await insertTestUser();

    const loginResult = await login({
      app,
      name: MOCK_USER.name,
      password: MOCK_USER.password,
    });

    accessToken = loginResult.accessToken;
  });

  afterEach(async () => {
    await clearDb(app.get(DataSource));
    await app.close();
  });

  it('/ (POST) - success', async () => {
    await insertTestUsageType();

    const response = await request(app.getHttpServer())
      .post('/carbon-usage')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        typeId: 1,
        amount: 5,
        usageAt: '2023-05-06T12:03:39.568Z',
      })
      .expect(201);

    expect(response.body.type.id).toBe('1');
    expect(response.body.amount).toBe(5);
  });

  it('/ (GET) - date filter success', async () => {
    await insertTestUsageType();

    const dates = [
      '2023-05-03T12:03:39.568Z',
      '2023-05-04T12:03:39.568Z',
      '2023-05-04T15:03:39.568Z',
      '2023-05-04T18:03:39.568Z',
      '2023-05-05T12:03:39.568Z',
    ];

    for (const date of dates) {
      await request(app.getHttpServer())
        .post('/carbon-usage')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          typeId: 1,
          amount: 5,
          usageAt: date,
        })
        .expect(201);
    }

    const response = await request(app.getHttpServer())
      .get('/carbon-usage')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({
        page: 1,
        pageSize: 10,
        from: '2023-05-04T00:03:39.568Z',
        to: '2023-05-04T23:03:39.568Z',
      })
      .expect(200);

    expect(response.body.items.map((item) => item.usageAt)).toEqual([
      '2023-05-04T12:03:39.568Z',
      '2023-05-04T15:03:39.568Z',
      '2023-05-04T18:03:39.568Z',
    ]);
  });
});
