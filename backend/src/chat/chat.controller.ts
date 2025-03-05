import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from '@prisma/client';
import { JwtAuthGuard } from 'auth/auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get()
    index(@Request() req): Promise<Chat[]> {
        const userId = req.user.id;
        return this.chatService.index(userId);
    }

}
