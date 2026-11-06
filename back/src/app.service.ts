import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) { }

  search(name: string) {
    return this.prismaService.user.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      },
      take: 5,
    });
  }
}
