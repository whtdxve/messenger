import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } })
  }

  async getUserChats(id: number) {
    const data = await this.prismaService.user.findUnique({
      where: { id: id },
      include: {
        chats: {
          include: {
            chat: {
              include: {
                users: {
                  where: {
                    userId: { not: id }
                  },
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const chats = data?.chats
    const result = chats?.map(row => ({
      id: row.chat.id,
      type: row.chat.type,
      name: row.chat.users[0].user.name
    }));

    return result
  }

  async getOpponentData(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id: id },
      select: {
        tag: true,
        name: true,
        profileImage: true
      }
    });
  }
}