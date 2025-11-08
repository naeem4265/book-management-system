import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { AuthorRepository } from '../repositories/author.repository';
import { AuthorResponseDto } from '../dtos/author-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthorService {
  private logger: Logger;
  constructor(private readonly authorRepository: AuthorRepository) {
    this.logger = new Logger(AuthorService.name);
  }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<AuthorResponseDto> {
    this.logger.log('Creating author');

    try {
      const author = await this.authorRepository.createAuthor(createAuthorDto);
      this.logger.log('Author created successfully: ', author.id);

      return plainToInstance(AuthorResponseDto, author, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error creating author', error);
      throw error;
    }
  }

  async getAllAuthors(): Promise<AuthorResponseDto[]> {
    this.logger.log('Getting all authors');

    try {
      const authors = await this.authorRepository.getAllAuthors();
      this.logger.log('Authors retrieved successfully: ', authors.length);

      return plainToInstance(AuthorResponseDto, authors, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error getting authors', error);
      throw error;
    }
  }

  async getAuthorById(id: string): Promise<AuthorResponseDto | null> {
    this.logger.log('Getting author by id: ', id);

    try {
      const author = await this.authorRepository.getAuthorById(id);
      if (!author) {
        this.logger.error('Author not found');
        throw new NotFoundException('Author with id ' + id + ' not found');
      }
      this.logger.log('Author retrieved successfully: ', author.id);

      return plainToInstance(AuthorResponseDto, author, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error getting author', error);
      throw error;
    }
  }
}
