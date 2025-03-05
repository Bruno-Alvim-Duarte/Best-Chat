import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { UserController } from './user/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from 'chat/chat.module';
import { ChatService } from 'chat/chat.service';

@Module({
  imports: [PrismaModule, PrismaModule, AuthModule, ChatModule],
  controllers: [UserController, ChatController],
  providers: [ChatGateway, UserService, ChatService],
})
export class AppModule {}
