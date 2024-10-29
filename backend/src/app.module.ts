import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { UserController } from './user/user.controller';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [ChatGateway, UserService],
})
export class AppModule {}
