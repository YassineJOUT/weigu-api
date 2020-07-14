import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
console.log(process.env.FRONT_HOST);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {credentials: true, origin: process.env.FRONT_HOST};
  app.enableCors(options);
  app.use(cookieParser());
  await app.listen(3010);
}
bootstrap();
