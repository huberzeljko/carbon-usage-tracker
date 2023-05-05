import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedDto } from '@app/shared';
import { applyDecorators, Type } from '@nestjs/common';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        title: `Paginated${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
