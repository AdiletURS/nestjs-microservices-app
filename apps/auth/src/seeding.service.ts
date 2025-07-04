// Путь: apps/auth/src/seeding.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserService } from './user/user.service';

@Injectable()
export class SeedingService implements OnModuleInit {
    constructor(private readonly userService: UserService) {}

    async onModuleInit() {
        // Запускаем сидинг только в режиме разработки
        if (process.env.NODE_ENV === 'development') {
            await this.seed();
        }
    }

    async seed() {
        const adminEmail = 'admin@example.com';
        const existingAdmin = await this.userService.findByEmail(adminEmail);

        if (!existingAdmin) {
            console.log('Seeding initial admin user...');
            await this.userService.create({
                email: adminEmail,
                password: 'adminpassword',
            });
            console.log('Admin user created.');
        }
    }
}