import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from '../dtos/create-book.dto';
import { BookRepository } from '../repositories/book.repository';
import { BookResponseDto } from '../dtos/book-response.dto';
import { plainToInstance } from 'class-transformer';
import { AuthorService } from 'src/modules/author/services/author.service';
import { QueryFailedError } from 'typeorm';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { BookQueryDto } from '../dtos/book-query.dto';
import { PaginatedResult } from 'src/common/types/pagination.types';

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

  async getAllBooks(query: BookQueryDto): Promise<PaginatedResult<BookResponseDto>> {
    this.logger.log('Getting all books');

    try {
      const { data, pagination } = await this.bookRepository.getAllBooks(query);

      this.logger.log(`Retrieved ${data.length} of ${pagination.totalItems} books`);

      const books = plainToInstance(BookResponseDto, data, {
        excludeExtraneousValues: true,
      });

      return { data: books, pagination };
    } catch (error) {
      this.logger.error('Error getting books', error);
      throw error;
    }
  }

  async getBookById(id: string): Promise<BookResponseDto> {
    this.logger.log('Getting book by id: ', id);

    try {
      const book = await this.bookRepository.getBookById(id);
      if (!book) {
        this.logger.error('Book not found');
        throw new NotFoundException('Book with id ' + id + ' not found');
      }
      this.logger.log('Book retrieved successfully: ', book.id);

      return plainToInstance(BookResponseDto, book, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error getting book', error);

      throw error;
    }
  }

  async updateBookById(id: string, updateBookDto: UpdateBookDto): Promise<BookResponseDto> {
    this.logger.log('Updating book by id: ', id);

    try {
      if (updateBookDto.authorId) {
        const author = await this.authorService.getAuthorById(updateBookDto.authorId);
        if (!author) {
          this.logger.error(`Author with id ${updateBookDto.authorId} not found`);
          throw new BadRequestException(`Author with id ${updateBookDto.authorId} does not exist`);
        }
      }

      const book = await this.bookRepository.updateBookById(id, updateBookDto);
      if (!book) {
        throw new NotFoundException('Book with id ' + id + ' not found');
      }
      this.logger.log('Book updated successfully: ', book.id);

      return plainToInstance(BookResponseDto, book, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error('Error updating book', error);
      if (error instanceof QueryFailedError) {
        const pgError = error as any;
        if (pgError.code === '23505') {
          const errorDetail = pgError.detail || '';
          if (errorDetail.includes('isbn') || errorDetail.includes('ISBN')) {
            throw new BadRequestException('A book with ISBN ' + updateBookDto.isbn + ' already exists');
          }
        }
      }
      throw error;
    }
  }

  async deleteBookById(id: string): Promise<void> {
    this.logger.log('Deleting book by id: ', id);

    try {
      await this.bookRepository.deleteBookById(id);
      this.logger.log('Book deleted successfully: ', id);
    } catch (error) {
      this.logger.error('Error deleting book', error);
      throw error;
    }
  }
}
