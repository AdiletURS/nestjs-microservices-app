// Путь: apps/auth/src/user/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: 'test@example.com',
        description: 'Уникальный email пользователя',
    })
    @IsEmail({}, { message: 'Некорректный email' })
    @IsNotEmpty({ message: 'Email не может быть пустым' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'Пароль (минимум 6 символов)' })
    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
    password: string;
}