import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) { }

  async getChatData(userId: number, chatId: number) {
    const chat = await this.prismaService.chat.findUnique({
      where: { id: chatId },
      include: {
        users: {
          where: {
            userId: { not: userId }
          },
          include: {
            user: true
          }
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          }
        }
      }
    });

    return {
      chat: {
        id: chat?.id,
        messages: chat?.messages

      },
      opponent: {
        name: chat?.users[0].user.name,
        profileImage: chat?.users[0].user.profileImage,
      }
    };
  }

  create(createChatDto: CreateChatDto) {
    return this.prismaService.chat.create({
      data: createChatDto,
    });
  }

  findAll() {
    return this.prismaService.chat.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaService.chat.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return user
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    const user = await this.prismaService.chat.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prismaService.chat.update({
      where: { id },
      data: updateChatDto,
    });
  }

  remove(id: number) {
    return this.prismaService.chat.delete({
      where: { id },
    });
  }
}
