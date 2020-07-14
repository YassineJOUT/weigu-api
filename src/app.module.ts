import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { dbModule } from './db/database.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    dbModule,
    UsersModule,
    MulterModule.register({
      dest: './files',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
