import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import { CreateAuthorDto } from '../dtos/create-author.dto';
@Injectable()
export class AuthorRepository extends Repository<Author> {
  constructor(dataSource: DataSource) {
    super(Author, dataSource.createEntityManager());
  }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.create(createAuthorDto);
    return this.save(author);
  }
}
