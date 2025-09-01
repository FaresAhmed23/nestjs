import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';

class HealthCheckDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  timestamp: string;

  @ApiProperty({ example: 'production' })
  environment: string;

  @ApiProperty({
    example: { mysql: true, mongodb: true },
    description: 'Service availability status',
  })
  services: {
    mysql: boolean;
    mongodb: boolean;
  };
}

class ApiInfoDto {
  @ApiProperty({ example: 'Expanders360 API' })
  name: string;

  @ApiProperty({ example: '1.0.0' })
  version: string;

  @ApiProperty({ example: 'Global Expansion Management API' })
  description: string;

  @ApiProperty({ example: '/api' })
  documentation: string;
}

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API root',
    description: 'Returns basic API information',
  })
  @ApiResponse({
    status: 200,
    description: 'API information',
    type: ApiInfoDto,
  })
  getHello(): ApiInfoDto {
    return {
      name: 'Expanders360 API',
      version: '1.0.0',
      description: 'Global Expansion Management API',
      documentation: '/api',
    };
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Check if the API and its dependencies are healthy',
  })
  @ApiResponse({
    status: 200,
    description: 'Health status',
    type: HealthCheckDto,
  })
  health(): HealthCheckDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        mysql: !!process.env.MYSQL_HOST,
        mongodb: !!process.env.MONGODB_URI,
      },
    };
  }
}
