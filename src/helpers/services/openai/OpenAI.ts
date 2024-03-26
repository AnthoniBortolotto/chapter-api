import { InternalServerErrorException } from '@nestjs/common';
import { createReadStream } from 'fs';
import { InternalServerError, OpenAI } from 'openai';
import { join } from 'path';

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
              'Você é um assistente que retorna um json com um objeto data com um array de 10 strings com palavras em maiusculo com a letra fornecida pelo usuário',
            name: 'Jonh',
          },
          { role: 'user', content: input },
        ],
        response_format: {
          type: 'json_object',
        },
        /*         tools: [
          {
            type: 'function',
            function: {
              name: 'covertToUpperCase',
              description:
                'Must use it to convert the words to uppercase, all of them should be in uppercase',
              parameters: {
                type: 'object',
                required: ['word'],
                properties: {
                  word: {
                    type: 'string',
                    description: 'Word to be converted to uppercase',
                  },
                },
              },
            },
          },
        ],
        tool_choice: {
          type: 'function',
          function: {
            name: 'covertToUpperCase',
          },
        }, */
        model: 'gpt-3.5-turbo',
      })
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on OpenAI');
      });
    return response.choices[0].message.content;
  }
  public async getImageAnswer(prompt: string) {
    const response = await this.instance.images
      .generate({
        prompt: prompt,
        model: 'dall-e-3',
        quality: 'standard',
        response_format: 'url',
        size: '1024x1024',
        style: 'natural',
      })
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on OpenAI');
      });
    return response.data[0].url;
  }
  public async getEditImageAnswer(prompt: string) {
    const file = createReadStream(join(process.cwd(), 'assets', 'editar.png'));

    const maskFile = createReadStream(join(process.cwd(), 'assets', 'mask.png'));
    const response = await this.instance.images
      .edit({
        image: file,
        mask: maskFile,
        prompt: prompt,
        model: 'dall-e-2',
        response_format: 'url',
      })
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on OpenAI');
      });
    return response;
  }
  public async getImageVariation() {
    console.log('getImageVariation');
    const file = await createReadStream(join(process.cwd(), 'assets', 'exemplo.png'));
    const response = await this.instance.images
      .createVariation({
        image: file,
        model: 'dall-e-2',
        response_format: 'url',
        size: '1024x1024',
      })
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on OpenAI');
      });
      console.log('response:', response);
    return response;
  }
  public getTranscriptionAnswer(): string {
    return 'Hello World!';
  }
  public getTextToSpeechAnswer(): string {
    return 'Hello World!';
  }
}
