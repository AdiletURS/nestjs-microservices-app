// Путь: apps/auth/src/user/entities/user.entity.ts
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users') // Указывает, что этот класс связан с таблицей 'users' в БД
export class User {
    @PrimaryGeneratedColumn() // Первичный ключ, авто-инкремент
    id: number;

    @Column({ unique: true }) // Колонка с email, значение должно быть уникальным
    email: string;

    @Column()
    @Exclude() // Этот декоратор скрывает поле при сериализации (когда мы отправляем объект в ответе)
    password: string;

    @Column({ nullable: true }) // Колонка для хэша refresh-токена, может быть пустой
    @Exclude()
    currentHashedRefreshToken?: string | null;

    // Хук TypeORM: эта функция выполнится автоматически перед тем, как
    // новая запись пользователя будет добавлена в базу данных.
    @BeforeInsert()
    async hashPassword() {
        // Хэшируем пароль с "солью" в 10 раундов
        this.password = await bcrypt.hash(this.password, 10);
    }
}