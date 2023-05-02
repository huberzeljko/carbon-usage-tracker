/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Config } from './config.interface';

export const configFactory = (): Config => ({
  origins: process.env.ORIGINS!.split(',') || [],
  database: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '') || 5432,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    databaseName: process.env.DB_DATABASE_NAME!,
  },
  security: {
    passwordHashSaltOrRounds: parseInt(
      process.env.SECURITY_PASSWORD_HASH_SALT_OR_ROUNDS!,
    ),
    jwt: {
      secret: process.env.SECURITY_JWT_SECRET!,
      durationInMinutes: parseInt(
        process.env.SECURITY_JWT_DURATION_IN_MINUTES!,
      ),
      issuer: process.env.SECURITY_JWT_ISSUER!,
      audience: process.env.SECURITY_JWT_AUDIENCE!,
    },
  },
});
