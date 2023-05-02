/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Config } from './config.interface';

export const configFactory = (): Config => ({
  database: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '') || 5432,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    databaseName: process.env.DB_DATABASE_NAME!,
  },
});
