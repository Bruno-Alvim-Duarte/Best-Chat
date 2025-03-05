import { Injectable } from '@nestjs/common';
import { Chat } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    async index(userId: number): Promise<Chat[]> {
        return this.prisma.chat.findMany({
            where: {
                participants: {
                    some: {
                        userId
                    }
                }
            }
        })
    }
}
