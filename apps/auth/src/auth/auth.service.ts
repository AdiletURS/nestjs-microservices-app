// Путь: apps/auth/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    // Проверка существования пользователя и корректности пароля
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user; // Возвращаем пользователя без пароля
            return result;
        }
        return null;
    }

    // Вход пользователя и выдача токенов
    async login(user: User) {
        const tokens = await this.getTokens(user.id, user.email);
        await this.userService.setCurrentRefreshToken(tokens.refreshToken, user.id);
        return tokens;
    }

    // Выход пользователя (удаление refresh токена из БД)
    async logout(userId: number) {
        return this.userService.removeRefreshToken(userId);
    }

    // Обновление пары токенов
    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.userService.findById(userId);
        if (!user || !user.currentHashedRefreshToken) {
            throw new UnauthorizedException('Access Denied');
        }

        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.currentHashedRefreshToken,
        );

        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Access Denied');
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.userService.setCurrentRefreshToken(tokens.refreshToken, user.id);
        return tokens;
    }

    // Приватный метод для генерации обоих токенов
    private async getTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            // Создаем access token
            this.jwtService.signAsync(
                { sub: userId, email }, // Полезная нагрузка
                {
                    secret: this.configService.get<string>('JWT_SECRET_KEY'),
                    expiresIn: '1h', // Срок жизни
                },
            ),
            // Создаем refresh token
            this.jwtService.signAsync(
                { sub: userId, email }, // Полезная нагрузка
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
                    expiresIn: '7d', // Срок жизни
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}