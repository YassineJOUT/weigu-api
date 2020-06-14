import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {credentials: true};
  app.enableCors(options);
  app.use(cookieParser());
  await app.listen(3010);
}
bootstrap();
