import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { UserController } from './user/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user/user.service';

@Module({
  imports: [PrismaModule, PrismaModule],
  controllers: [UserController],
  providers: [ChatGateway, UserService],
})
export class AppModule {}
