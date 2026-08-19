import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThemePreference, ColorMode, User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  createGuest(name: string): Promise<User> {
    const guest = this.usersRepository.create({
      name,
      isGuest: true,
      email: null,
      password: null,
    });
    return this.usersRepository.save(guest);
  }

  createRegistered(
    name: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      isGuest: false,
    });
    return this.usersRepository.save(user);
  }

  // Updates theme and/or color mode. Only updates the fields
  // that were actually provided — this is why we accept a
  // partial object instead of always requiring both.
  async updateTheme(
    id: string,
    updates: { theme?: ThemePreference; colorMode?: ColorMode },
  ): Promise<User | null> {
    await this.usersRepository.update(id, updates);
    return this.findById(id);
  }
}