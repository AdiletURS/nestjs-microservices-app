// Путь: apps/auth/src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    // Внедряем репозиторий для работы с сущностью User
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // Метод для создания нового пользователя
    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        // Метод .save() вызовет хук @BeforeInsert и захэширует пароль
        return this.userRepository.save(user);
    }

    // Метод для поиска пользователя по email
    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    // Метод для поиска пользователя по ID
    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }

    // Метод для сохранения хэша refresh-токена
    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
            currentHashedRefreshToken: hashedRefreshToken,
        });
    }

    // Метод для удаления refresh-токена (при логауте)
    async removeRefreshToken(userId: number) {
        return this.userRepository.update(userId, {
            currentHashedRefreshToken: null,
        });
    }
}