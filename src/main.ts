import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {credentials: true, origin: 'http://localhost:3000'};
  app.enableCors(options);
  await app.listen(3010);
}
bootstrap();
