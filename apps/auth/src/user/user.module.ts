// Путь: apps/auth/src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // Регистрируем нашу сущность User, чтобы TypeORM о ней знал
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  // Экспортируем UserService, чтобы его можно было "внедрять" в другие модули (например, в AuthModule)
  exports: [UserService],
})
export class UserModule {}