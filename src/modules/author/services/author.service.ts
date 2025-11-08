import { Injectable, Logger } from '@nestjs/common';
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
}
