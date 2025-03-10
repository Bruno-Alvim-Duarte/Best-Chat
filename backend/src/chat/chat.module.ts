import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { AuthModule } from "auth/auth.module";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {};