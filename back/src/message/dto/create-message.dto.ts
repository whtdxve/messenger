import { MessageStatus } from "src/generated/prisma/enums";

export class CreateMessageDto {
    status!: MessageStatus;
    content!: string;
    userId!: number;
    chatId!: number;
}
