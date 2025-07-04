// Путь: apps/auth/src/auth/dto/login.dto.ts
import { CreateUserDto } from '../../user/dto/create-user.dto';

// Мы можем просто унаследовать его, так как поля те же
export class LoginDto extends CreateUserDto {}