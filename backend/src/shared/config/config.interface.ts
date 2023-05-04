export interface Config {
  origins: string[];
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    databaseName: string;
  };
  security: {
    passwordHashSaltOrRounds: string | number;
    jwt: {
      secret: string;
      durationInMinutes: number;
      issuer: string;
      audience: string;
    };
    refreshToken: {
      secret: string;
      durationInMinutes: number;
    };
  };
}
