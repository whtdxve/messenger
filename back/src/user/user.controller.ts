import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) { }

  @Get('get-user-chats')
  @UseGuards(JwtAuthGuard)
  getUserChats(@Req() req: Request) {
    const user = (req as any).user;
    return this.UserService.getUserChats(user.userId);
  }

  @Get('get-opponent-data/:id')
  @UseGuards(JwtAuthGuard)
  getOpponentData(@Param('id') id: string) {
    return this.UserService.getOpponentData(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.UserService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.UserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.UserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.UserService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.UserService.remove(+id);
  }
}
