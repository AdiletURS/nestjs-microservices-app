// Путь: apps/auth/src/auth/strategies/at.strategy.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = {
    sub: string;
    email: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлекаем токен из заголовка Authorization
            secretOrKey: config.get<string>('JWT_SECRET_KEY')!,
        });
    }

    validate(payload: JwtPayload) {
        // Passport добавляет этот объект в request.user
        return payload;
    }
}