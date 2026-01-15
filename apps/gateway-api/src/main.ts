import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors(
    {
      origin: ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
  );
  app.setGlobalPrefix('api/v1');
  // documentar apis
  const config = new DocumentBuilder()
    .setTitle('POS API Gateway - Auth')
    .setDescription('Contrato público del API Gateway del POS')
    .setVersion('1.0.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  console.log(`Gateway on http://localhost: ${await app.getUrl()}`);
}
bootstrap();
