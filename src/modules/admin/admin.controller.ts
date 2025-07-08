import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './admin.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(createAdminDto);
  }

  @Get('estadisticas')
  async getEstadisticas(): Promise<any> {
    return this.adminService.getEstadisticas();
  }

  @Get()
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Admin | null> {
    return this.adminService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<CreateAdminDto>): Promise<Admin | null> {
    return this.adminService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Admin | null> {
    return this.adminService.delete(id);
  }
}
