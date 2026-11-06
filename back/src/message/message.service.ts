import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createMessageDto: CreateMessageDto) {
    return this.prismaService.message.create({
      data: createMessageDto,
    });
  }

  findAll() {
    return this.prismaService.message.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaService.message.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return user
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const user = await this.prismaService.message.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prismaService.message.update({
      where: { id },
      data: updateMessageDto,
    });
  }

  remove(id: number) {
    return this.prismaService.message.delete({
      where: { id },
    });
  }
}
