import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { server } from "./config/app";

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule);


  await app.listen(server.port);
  logger.log(`Application listening on port ${server.port}`);
}
bootstrap();
