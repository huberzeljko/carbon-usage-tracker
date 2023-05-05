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
} from '@nestjs/common';
import { CarbonUsageTypeService } from '@app/application/carbon-usage/services';
import {
  CarbonUsageTypeDto,
  CreateCarbonUsageTypeDto,
  UpdateCarbonUsageTypeDto,
} from '@app/application/carbon-usage/dtos';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Carbon Usage Type')
@Controller('carbon-usage-type')
export class CarbonUsageTypeController {
  constructor(private readonly usageTypeService: CarbonUsageTypeService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CarbonUsageTypeDto,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  get(@Param('id') id: number) {
    return this.usageTypeService.getCarbonUsageType(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Carbon usage type created.',
    type: CarbonUsageTypeDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({
    type: CreateCarbonUsageTypeDto,
  })
  create(@Body() input: CreateCarbonUsageTypeDto) {
    return this.usageTypeService.createCarbonUsageType(input);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBody({
    type: UpdateCarbonUsageTypeDto,
  })
  update(@Param('id') id: number, @Body() input: UpdateCarbonUsageTypeDto) {
    return this.usageTypeService.updateCarbonUsageType(id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'Not found' })
  remove(@Param('id') id: number) {
    return this.usageTypeService.removeCarbonUsageType(id);
  }
}
