import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const apiApp = await NestFactory.create<NestExpressApplication>(AppModule);
  apiApp.disable('x-powered-by');
  apiApp.enableCors({ origin: '*' });
  apiApp.setGlobalPrefix('api');
  apiApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors = []) => {
        const messages = validationErrors.flatMap((error) =>
          Object.values(error.constraints || {}).map((msg) => ({
            text: msg,
            type: 'error',
          })),
        );

        return new BadRequestException({
          data: null,
          messages,
        });
      },
    }),
  );
  const port = process.env.PORT ?? 3000;
  await apiApp.listen(port);
  // Configuration Web Socket Server
  // const wsApp = await NestFactory.create(AppModule);
  // wsApp.enableCors({ origin: '*' });
  // wsApp.setGlobalPrefix('ws');
  // wsApp.useWebSocketAdapter(new WsAdapter(wsApp));
  // await wsApp.listen(3001);

  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
