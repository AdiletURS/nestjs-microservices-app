// Путь: apps/auth/src/auth/auth.controller.ts
import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import {UnauthorizedException} from '@nestjs/common';
@ApiTags('Authentication') // Группировка эндпоинтов в Swagger
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({ status: 201, description: 'Пользователь успешно создан.' })
    @ApiResponse({ status: 400, description: 'Некорректные данные.' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Вход пользователя' })
    @ApiResponse({ status: 200, description: 'Успешный вход.' })
    @ApiResponse({ status: 401, description: 'Неверные учетные данные.' })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        if (!user) {
            throw new UnauthorizedException('Неверные учетные данные');
        }
        return this.authService.login(user);
    }

    @ApiBearerAuth() // Указываем в Swagger, что эндпоинт требует Bearer токен
    @ApiOperation({ summary: 'Выход пользователя' })
    @ApiResponse({ status: 200, description: 'Успешный выход.' })
    @UseGuards(AuthGuard('jwt')) // Защищаем роут с помощью access token стратегии
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req: Request) {
        const user = req.user as { sub: number };
        return this.authService.logout(user.sub);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Обновление токенов' })
    @ApiResponse({ status: 200, description: 'Токены успешно обновлены.' })
    @UseGuards(AuthGuard('jwt-refresh')) // Защищаем роут с помощью refresh token стратегии
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req: Request) {
        const user = req.user as { sub: number; refreshToken: string };
        return this.authService.refreshTokens(user.sub, user.refreshToken);
    }
}