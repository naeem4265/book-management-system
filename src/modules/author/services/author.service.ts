import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { AuthorRepository } from '../repositories/author.repository';
import { AuthorResponseDto } from '../dtos/author-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { PaginatedResult } from 'src/common/types/pagination.types';

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

  async getAllAuthors(paginationQuery: PaginationParamsDto): Promise<PaginatedResult<AuthorResponseDto>> {
    this.logger.log('Getting all authors');

    try {
      const { data, pagination } = await this.authorRepository.getAllAuthors(paginationQuery);

      this.logger.log(`Retrieved ${data.length} of ${pagination.totalItems} authors`);

      const authors = plainToInstance(AuthorResponseDto, data, {
        excludeExtraneousValues: true,
      });

      return { data: authors, pagination };
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

  async updateAuthorById(id: string, updateAuthorDto: UpdateAuthorDto): Promise<AuthorResponseDto> {
    this.logger.log('Updating author by id: ', id);

    try {
      const updatedAuthor = await this.authorRepository.updateAuthorById(id, updateAuthorDto);
      this.logger.log('Author updated successfully: ', updatedAuthor.id);

      return plainToInstance(AuthorResponseDto, updatedAuthor, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error updating author', error);
      throw error;
    }
  }

  async deleteAuthorById(id: string): Promise<void> {
    this.logger.log('Deleting author by id: ', id);

    try {
      await this.authorRepository.deleteAuthorById(id);
      this.logger.log('Author deleted successfully: ', id);
    } catch (error) {
      this.logger.error('Error deleting author', error);
      throw error;
    }
  }
}
