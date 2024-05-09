import { Body, Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    console.log('Este é o env', process.env);
    console.log('Este é a key', process.env.OPENAI_API_KEY);
    console.log('Este é a porta', process.env.PORT);
    return { message: 'Hello World!' };
  }
  @Get('chat')
  async getGptChatAnswer(@Body() body: any){
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
  async getTranscriptionAnswer() {
    return await this.appService.SpeechToText();
  }
  @Get('translation')
  async getTranslationAnswer() {
    return await this.appService.Translation();
  }
  @Get('text-to-speech')
  async getTextToSpeechAnswer(@Body() body: any) {
    return await this.appService.textToSpeech(body.prompt, body.filename, body.speed);
  }
}
