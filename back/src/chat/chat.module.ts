import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MessageService } from 'src/message/message.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, MessageService],
})
export class ChatModule {}
