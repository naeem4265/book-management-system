import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BookController } from './controllers/book.controller';
import { BookService } from './services/book.service';
import { BookRepository } from './repositories/book.repository';
import { AuthorModule } from '../author/author.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorModule],
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookService],
})
export class BookModule {}
