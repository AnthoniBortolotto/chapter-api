import { Body, Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { createReadStream } from 'fs';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getGptChatAnswer(@Body() body: any): Promise<string> {
    return await this.appService.completeChat(body.input);
  }
  @Get('image')
  getImageAnswer(@Body() body) {
    return this.appService.generateImage(body.prompt);
  }
  @Get('edit-image')
  getEditImageAnswer(@Body() body: any) {
    console.log('body:', body);
    return this.appService.editImage(body?.prompt);
  }
  @Get('transcription')
  getTranscriptionAnswer(): string {
    return this.appService.getHello();
  }
  @Get('text-to-speech')
  getTextToSpeechAnswer(): string {
    return this.appService.getHello();
  }
}
