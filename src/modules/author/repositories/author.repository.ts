import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { UpdateAuthorDto } from '../dtos/update-author.dto';

@Injectable()
export class AuthorRepository extends Repository<Author> {
  constructor(dataSource: DataSource) {
    super(Author, dataSource.createEntityManager());
  }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.create(createAuthorDto);
    return this.save(author);
  }

  async getAllAuthors(): Promise<Author[]> {
    return this.find();
  }

  async getAuthorById(id: string): Promise<Author | null> {
    return this.findOneBy({ id });
  }

  async updateAuthorById(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.getAuthorById(id);
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    Object.assign(author, updateAuthorDto);
    return await this.save(author);
  }

  async deleteAuthorById(id: string): Promise<void> {
    const result = await this.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }
}
