import { Injectable } from '@nestjs/common';
import { OpenAIClient } from './helpers/services/openai/OpenAI';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  async completeChat(input: string){
    console.log('input:', input);
    const openai = new OpenAIClient();
    const response = await openai.getGptChatAnswer(input);
    return response;
  }
  async generateImage(prompt: string){
    console.log('prompt:', prompt);
    const openai = new OpenAIClient();
    const response = await openai.getImageAnswer(prompt);
    return response;
  }

  async editImage(prompt?: string) {
    const openai = new OpenAIClient();
    if (prompt) {
      console.log('prompt');
      const response = await openai.getEditImageAnswer(prompt);
      return response;
    } else {
      console.log('no prompt');
      const response = await openai.getImageVariation();
      return response;
    }
  }

  async textToSpeech(prompt: string, filename: string, speed: number) {
    const openai = new OpenAIClient();
    const response = await openai.getTextToSpeechAnswer(
      prompt,
      filename,
      speed,
    );

    return {
      message: 'success',
    };
  }

  async SpeechToText() {
      const openai = new OpenAIClient();
      const response = await openai.getTranscriptionAnswer();
      return response;
  }
  async Translation() {
    const openai = new OpenAIClient();
    const response = await openai.getTranslationAnswer();
    return response;
}
}
