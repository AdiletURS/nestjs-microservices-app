// Путь: apps/auth/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    // 1. Модуль для работы с переменными окружения.
    // Он загрузит переменные из нашего .env файла.
    ConfigModule.forRoot({
      envFilePath: './apps/auth/.env',
      isGlobal: true,
    }),
    // 2. Модуль для подключения к базе данных.
    // Он использует загруженные переменные для конфигурации.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT!, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true, // Автоматически находить и загружать все наши Entity.
      synchronize: true, // Для разработки: автоматически создает/обновляет таблицы в БД.
      // ВАЖНО: на продакшене это нужно выключить и использовать миграции.
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}