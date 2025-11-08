import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dtos/create-book.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { BookQueryDto } from '../dtos/book-query.dto';
import { PaginatedResult, Pagination } from 'src/common/types/pagination.types';

@Injectable()
export class BookRepository extends Repository<Book> {
  constructor(dataSource: DataSource) {
    super(Book, dataSource.createEntityManager());
  }

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    return await this.save(this.create(createBookDto));
  }

  async getAllBooks(query: BookQueryDto): Promise<PaginatedResult<Book>> {
    try {
      const { limit, page, search, authorId } = query;

      const queryBuilder = this.createQueryBuilder('book').leftJoinAndSelect('book.author', 'author');

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        queryBuilder.andWhere('(book.title ILIKE :searchTerm OR book.isbn ILIKE :searchTerm)', { searchTerm });
      }

      if (authorId) {
        queryBuilder.andWhere('book.authorId = :authorId', { authorId });
      }

      if (limit && page) {
        queryBuilder.skip((page - 1) * limit).take(limit);
      } else if (limit) {
        queryBuilder.take(limit);
      }
      queryBuilder.orderBy('book.createdAt', 'DESC');

      const [books, totalItems] = await queryBuilder.getManyAndCount();

      const pagination: Pagination = {
        totalItems,
        currentPage: limit ? (page ?? 1) : undefined,
        totalPages: limit ? Math.ceil(totalItems / limit) : undefined,
        itemsPerPage: limit ?? undefined,
        hasNextPage: !!limit && (page ?? 1) * limit < totalItems,
        hasPreviousPage: !!limit && (page ?? 1) > 1,
      };

      return {
        data: books,
        pagination,
      };
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  }

  async getBookById(id: string): Promise<Book | null> {
    return this.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async updateBookById(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.preload({
      id,
      ...updateBookDto,
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    await this.save(book);
    const updatedBook = await this.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }

  async deleteBookById(id: string): Promise<void> {
    const result = await this.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
}
