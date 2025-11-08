import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateBookDto } from '../dtos/create-book.dto';
import { BookRepository } from '../repositories/book.repository';
import { BookResponseDto } from '../dtos/book-response.dto';
import { plainToInstance } from 'class-transformer';
import { AuthorService } from 'src/modules/author/services/author.service';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class BookService {
  private logger: Logger;
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly authorService: AuthorService,
  ) {
    this.logger = new Logger(BookService.name);
  }

  async createBook(createBookDto: CreateBookDto): Promise<BookResponseDto> {
    this.logger.log('Creating book');

    try {
      const author = await this.authorService.getAuthorById(createBookDto.authorId);
      if (!author) {
        this.logger.error(`Author with id ${createBookDto.authorId} not found`);
        throw new BadRequestException(`Author with id ${createBookDto.authorId} does not exist`);
      }

      const book = await this.bookRepository.createBook(createBookDto);

      this.logger.log('Book created successfully: ', book.id);

      const bookWithAuthor = await this.bookRepository.getBookById(book.id);
      if (!bookWithAuthor) {
        throw new Error('Failed to retrieve created book');
      }
      return plainToInstance(BookResponseDto, bookWithAuthor, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error creating book', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof QueryFailedError) {
        const pgError = error as any;
        if (pgError.code === '23505') {
          const errorDetail = pgError.detail || '';
          if (errorDetail.includes('isbn') || errorDetail.includes('ISBN')) {
            throw new BadRequestException('A book with ISBN ' + createBookDto.isbn + ' already exists');
          }
        }
      }

      throw error;
    }
  }
}
