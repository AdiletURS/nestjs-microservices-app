// Путь: apps/auth/src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Это нужно для корректной работы DI в кастомных валидаторах
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Глобальный префикс для всех роутов, например /api/auth/login
  app.setGlobalPrefix('api');

  // Глобальный пайп для валидации всех входящих данных
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Отбрасывать свойства, которых нет в DTO
    transform: true, // Автоматически преобразовывать типы
  }));

  // Глобальный интерсептор для корректной работы декоратора @Exclude() в Entity
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Конфигурация Swagger
  const config = new DocumentBuilder()
      .setTitle('Auth Microservice')
      .setDescription('API для регистрации и аутентификации пользователей')
      .setVersion('1.0')
      .addBearerAuth() // Добавляем иконку замка для ввода токена
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Путь для UI Swagger

  await app.listen(process.env.AUTH_APP_PORT || 3001);
  console.log(`Auth service is running on: ${await app.getUrl()}/api/docs`);
}
bootstrap();