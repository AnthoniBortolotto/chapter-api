import { InternalServerErrorException } from '@nestjs/common';
import { InternalServerError, OpenAI } from 'openai';

export class OpenAIClient {
  private instance: OpenAI;

  constructor() {
    const configuration = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
    this.instance = configuration;
  }

  public async getGptChatAnswer(input: string) {
    const response = await this.instance.chat.completions
      .create({
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente que retorna um json com um objeto data com um array de 10 strings com palavras com a letra fornecida pelo usuário',
            name: 'Jonh',
          },
          { role: 'user', content: input },
        ],
        response_format: {
          type: 'json_object',
        },
        model: 'gpt-3.5-turbo',
      })
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on OpenAI');
      });
    return response.choices[0].message.content;
  }
  public getImageAnswer(): string {
    return 'Hello World!';
  }
  public getEditImageAnswer(): string {
    return 'Hello World!';
  }
  public getTranscriptionAnswer(): string {
    return 'Hello World!';
  }
  public getTextToSpeechAnswer(): string {
    return 'Hello World!';
  }
}
