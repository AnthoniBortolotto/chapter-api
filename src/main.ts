import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = await app.listen(3000);
  server.setTimeout(
    // 10 minutes
    10 * 60 * 1000,
  );
}
bootstrap();
