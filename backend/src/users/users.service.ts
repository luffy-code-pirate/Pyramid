import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThemePreference, User } from './user.entity';

@Injectable()
export class UsersService {
  // TypeORM gives us a "Repository" for each entity — an object
  // with built-in methods (find, save, update, etc.) for talking
  // to that entity's table. @InjectRepository wires it in for us.
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Find a single user by their ID. Returns null if not found —
  // callers decide what to do about that (e.g. throw a 404).
  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Used during login — look a user up by their email address.
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  // Creates a guest account: no email, no password, isGuest = true.
  createGuest(name: string): Promise<User> {
    const guest = this.usersRepository.create({
      name,
      isGuest: true,
      email: null,
      password: null,
    });
    return this.usersRepository.save(guest);
  }

  // Creates a full registered account. Note: this expects an
  // ALREADY-HASHED password — hashing happens in AuthService,
  // not here. UsersService should stay focused on database
  // operations only, not security logic.
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

  // Updates a user's theme preference and returns the updated user.
  async updateTheme(id: string, theme: ThemePreference): Promise<User | null> {
    await this.usersRepository.update(id, { theme });
    return this.findById(id);
  }
}