import { InternalServerErrorException } from '@nestjs/common';
import { createReadStream, promises } from 'fs';
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
          /*  {
            role: 'system',
            content:
              'Você é um assistente que retorna um json com um objeto data com um array de 10 strings com palavras em maiusculo com a letra fornecida pelo usuário',
            name: 'Jonh',
          }, */
          { role: 'user', content: input },
        ],
        response_format: {
          type: 'text',
        },
        tools: [
          {
            type: 'function',
            function: {
              name: 'get_current_weather',
              description: 'Get the current weather in a given location',
              parameters: {
                type: 'object',
                properties: {
                  location: {
                    type: 'string',
                    description: 'The city and state, e.g. San Francisco, CA',
                  },
                  unit: {
                    type: 'string',
                    enum: ['celsius', 'fahrenheit'],
                  },
                },
                required: ['location'],
              },
            },
          },
        ],
        tool_choice: 'auto',
        model: 'gpt-3.5-turbo',
      })
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on OpenAI');
      });
    return response;
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

    const maskFile = createReadStream(
      join(process.cwd(), 'assets', 'mask.png'),
    );
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
    const file = await createReadStream(
      join(process.cwd(), 'assets', 'exemplo.png'),
    );
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
  public async getTranscriptionAnswer() {
    const file = createReadStream(
      join(process.cwd(), 'assets', 'transcription.mp3'),
    );
    const response = await this.instance.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      response_format: 'verbose_json',
      language: 'pt',
      temperature: 0.5,
      timestamp_granularities: ['word'],
    });
    return response;
  }
  public async getTranslationAnswer() {
    const file = createReadStream(
      join(process.cwd(), 'assets', 'transcription.mp3'),
    );
    const response = await this.instance.audio.translations
      .create({
        file: file,
        model: 'whisper-1',
        response_format: 'json',
      })
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on OpenAI');
      });
    return response;
  }
  public async getTextToSpeechAnswer(
    textToSpeech: string,
    filename: string,
    speed = 1,
  ) {
    const response = await this.instance.audio.speech
      .create({
        model: 'tts-1',
        input: textToSpeech,
        voice: 'shimmer',
        response_format: 'mp3',
        speed: speed,
      })
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on OpenAI');
      });
    const buffer = Buffer.from(await response.arrayBuffer());
    await promises
      .writeFile(join(process.cwd(), 'assets', `${filename}.mp3`), buffer)
      .catch((error) => {
        console.log('error:', error);
        throw new InternalServerErrorException('Error on write file');
      });
  }
}
