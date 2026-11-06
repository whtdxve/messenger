import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('get-chat-data/:chatId')
  @UseGuards(JwtAuthGuard)
  getChatData(@Req() req: Request, @Param('chatId') chatId: string) {
    const user = (req as any).user;
    return this.chatService.getChatData(+user.userId, +chatId);
  }

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
