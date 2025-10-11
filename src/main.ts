import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = PORT || 3000;
  await app.listen(port);
  app.enableCors();
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
