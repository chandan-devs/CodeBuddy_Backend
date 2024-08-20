import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users', error.message);
    }
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ email });
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving user', error.message);
    }
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.usersRepository.create(user);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user', error.message);
    }
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    try {
      const updateResult = await this.usersRepository.update(id, user);
      if (updateResult.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Error updating user', error.message);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const deleteResult = await this.usersRepository.delete(id);
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting user', error.message);
    }
  }
}
