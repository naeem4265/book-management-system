import { Module } from '@nestjs/common';
import { AuthorController } from './controllers/author.controller';
import { AuthorService } from './services/author.service';

@Module({
  providers: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}
