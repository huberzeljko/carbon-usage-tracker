import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbContext } from '../services';
import { ILike } from 'typeorm';

@Injectable()
export class UserSeedService implements OnModuleInit {
  constructor(private readonly dbContext: DbContext) {}

  async onModuleInit(): Promise<any> {
    const user = this.dbContext.users.create({
      name: 'admin',
      firstName: 'admin',
      lastName: 'admin',
      password: 'admin',
    });

    const hasAdmin = await this.dbContext.users.exist({
      where: { name: ILike(user.name) },
    });

    if (!hasAdmin) {
      await this.dbContext.users.save(user);
    }
  }
}
