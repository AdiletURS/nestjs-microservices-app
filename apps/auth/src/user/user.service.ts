// Файл: apps/auth/src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto'; // Создадим этот файл на следующем шаге
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | undefined | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | undefined | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        // Здесь мы должны хэшировать токен перед сохранением
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
            currentHashedRefreshToken: hashedRefreshToken,
        });
    }

    async removeRefreshToken(userId: number) {
        return this.userRepository.update(userId, {
            currentHashedRefreshToken: null,
        });
    }
}