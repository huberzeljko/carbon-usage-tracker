import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

export async function login({
  app,
  name,
  password,
}: {
  app: INestApplication;
  name: string;
  password: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await request(app.getHttpServer())
    .post('/account/login')
    .send({
      name: name,
      password: password,
    });

  if (response.status !== 201) {
    throw new Error('Login failed');
  }

  return response.body;
}
