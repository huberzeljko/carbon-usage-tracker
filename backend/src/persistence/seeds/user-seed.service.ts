import { Injectable, OnModuleInit } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { PasswordService } from '@app/shared/services';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/domain';

@Injectable()
export class UserSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
  ) {}

  async onModuleInit(): Promise<any> {
    const user = this.userRepository.create({
      name: 'admin',
      firstName: 'admin',
      lastName: 'admin',
      password: await this.passwordService.hashPassword('admin1'),
    });

    const hasAdmin = await this.userRepository.exist({
      where: { name: ILike(user.name) },
    });

    if (!hasAdmin) {
      await this.userRepository.save(user);
    }
  }
}
