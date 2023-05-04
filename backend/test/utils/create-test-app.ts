import { INestApplication } from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '@app/app.module';

export type TestingModuleConfig = (
  builder: TestingModuleBuilder,
) => TestingModuleBuilder;

export async function createTestApp(
  config?: TestingModuleConfig,
): Promise<{ app: INestApplication; url: string }> {
  let moduleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (config) {
    moduleBuilder = config(moduleBuilder);
  }

  const moduleFixture: TestingModule = await moduleBuilder.compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  await app.listen(0);
  return {
    app: app,
    url: (await app.getUrl())
      .replace('[::1]', 'localhost')
      .replace(':::', 'localhost:'),
  };
}
