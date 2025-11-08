import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dtos/create-book.dto';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    return await this.save(this.create(createBookDto));
  }

  async getBookById(id: string): Promise<Book | null> {
    return this.findOne({
      where: { id },
      relations: ['author'],
    });
  }
}
