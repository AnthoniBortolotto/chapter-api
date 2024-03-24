import { Injectable } from '@nestjs/common';
import { OpenAIClient } from './helpers/services/openai/OpenAI';

@Injectable()
export class AppService {
  async completeChat(input: string): Promise<string> {
    console.log('input:', input);
    const openai = new OpenAIClient();
    const response = await openai.getGptChatAnswer(input);
    return response;
  }
  getHello(): string {
    return ;
  }
}
