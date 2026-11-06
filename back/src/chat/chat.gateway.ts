import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service'; // Импортируем Prisma
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';

interface JoinChatDto {
    chatId: string;
}

@WebSocketGateway({
    cors: {
        origin: ["http://localhost:3001"], // Укажите домен вашего Next.js приложения
        credentials: true,
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    private logger: Logger = new Logger('ChatGateway');

    constructor(private readonly messageService: MessageService) { }

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinChat')
    handleJoinChat(@MessageBody() joinChatDto: JoinChatDto, @ConnectedSocket() client: Socket): void {
        const { chatId } = joinChatDto;
        client.join(chatId);
        this.logger.log(`Client ${client.id} joined chat ${chatId}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() createMessageDto: CreateMessageDto): Promise<void> {
        const { content, chatId, userId } = createMessageDto;

        const newMessage = await this.messageService.create(createMessageDto);

        const messageForBroadcast = {
            id: newMessage.id,
            content: newMessage.content,
            userId: newMessage.userId,
        };

        this.server.to(String(chatId)).emit('newMessage', messageForBroadcast);
    }
}