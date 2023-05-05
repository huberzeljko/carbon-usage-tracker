import { DataSource } from 'typeorm';

export async function clearDb(dataSource: DataSource) {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    if (entity.tableType === 'view') continue;

    if (entity.schema) {
      // we cannot use getRepository for any schema other than the public one
      await dataSource
        .createQueryBuilder()
        .delete()
        .from(entity.tableName)
        .execute();
    } else {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(
        `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
