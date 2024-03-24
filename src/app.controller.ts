import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getGptChatAnswer(@Body() body: any): Promise<string> {
    return await this.appService.completeChat(body.input);
  }
  @Get('image')
  getImageAnswer(): string {
    return this.appService.getHello();
  }
  @Get('edit-image')
  getEditImageAnswer(): string {
    return this.appService.getHello();
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
