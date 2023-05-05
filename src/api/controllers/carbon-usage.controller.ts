import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CarbonUsageService } from '@app/application/carbon-usage/services';
import { CurrentUser } from '@app/shared/decorators';
import { JwtUser } from '@app/application/account/interfaces';
import {
  CarbonUsageDto,
  CarbonUsageFilterDto,
  CreateCarbonUsageDto,
  UpdateCarbonUsageDto,
} from '@app/application/carbon-usage/dtos';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedDto } from '@app/shared';
import { ApiPaginatedResponse } from '@app/api/utils';

@ApiBearerAuth()
@ApiTags('Carbon Usage')
@Controller('carbon-usage')
@ApiExtraModels(PaginatedDto)
export class CarbonUsageController {
  constructor(private readonly usageService: CarbonUsageService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CarbonUsageDto,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  get(@Param('id') id: number, @CurrentUser() user: JwtUser) {
    return this.usageService.getCarbonUsage({ id, userId: user.id });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(CarbonUsageDto)
  @ApiQuery({
    name: 'page',
    type: Number,
    required: true,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: true,
    description: 'Page size',
  })
  @ApiQuery({
    name: 'from',
    type: Date,
    required: false,
    description: 'From date',
  })
  @ApiQuery({
    name: 'to',
    type: Date,
    required: false,
    description: 'To date',
  })
  @ApiQuery({
    name: 'sortField',
    type: String,
    required: false,
    description: 'Sort field: "amount", "usageAt" or "type"',
  })
  @ApiQuery({
    name: 'sortDirection',
    type: String,
    required: false,
    description: 'Sort direction: "ASC" or "DESC"',
  })
  getMany(@Query() filter: CarbonUsageFilterDto, @CurrentUser() user: JwtUser) {
    return this.usageService.getManyCarbonUsages({
      ...filter,
      userId: user.id,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Carbon usage created.',
    type: CarbonUsageDto,
  })
  @ApiBody({
    type: CreateCarbonUsageDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  create(
    @Body() input: CreateCarbonUsageDto,
    @CurrentUser() user: JwtUser,
  ): Promise<CarbonUsageDto> {
    return this.usageService.createCarbonUsage({ ...input, userId: user.id });
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({
    type: UpdateCarbonUsageDto,
  })
  update(
    @Param('id') id: number,
    @Body() input: UpdateCarbonUsageDto,
    @CurrentUser() user: JwtUser,
  ) {
    return this.usageService.updateCarbonUsage(id, {
      ...input,
      userId: user.id,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'Not found' })
  remove(@Param('id') id: number, @CurrentUser() user: JwtUser) {
    return this.usageService.removeCarbonUsage({ id, userId: user.id });
  }
}
