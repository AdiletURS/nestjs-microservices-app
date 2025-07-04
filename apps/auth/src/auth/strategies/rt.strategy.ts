// Путь: apps/auth/src/auth/strategies/rt.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT_REFRESH_SECRET_KEY')!,
            passReqToCallback: true, // Передаем объект request в колбэк validate
        });
    }

    validate(req: Request, payload: any) {
        const raw = req.get('authorization')!;
        const refreshToken = raw.replace('Bearer', '').trim();
        // const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        // Возвращаем полезную нагрузку и сам refresh токен
        return { ...payload, refreshToken };
    }
}