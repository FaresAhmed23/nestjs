import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorResponseDto } from './dto/vendor-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Vendors')
@ApiBearerAuth('JWT-auth')
@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new vendor',
    description: 'Create a new service vendor (Admin only)'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Vendor created successfully',
    type: VendorResponseDto
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  create(@Body() createVendorDto: CreateVendorDto): Promise<VendorResponseDto> {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all vendors',
    description: 'Get list of all service vendors'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of vendors',
    type: [VendorResponseDto]
  })
  findAll(): Promise<VendorResponseDto[]> {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get vendor by ID',
    description: 'Get detailed information about a specific vendor'
  })
  @ApiParam({ name: 'id', description: 'Vendor UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vendor details',
    type: VendorResponseDto
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  findOne(@Param('id') id: string): Promise<VendorResponseDto> {
    return this.vendorsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Update vendor',
    description: 'Update vendor information (Admin only)'
  })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Vendor updated successfully',
    type: VendorResponseDto
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto): Promise<VendorResponseDto> {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete vendor',
    description: 'Delete a vendor (Admin only)'
  })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiResponse({ status: 204, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  remove(@Param('id') id: string): Promise<void> {
    return this.vendorsService.remove(id);
  }
}
