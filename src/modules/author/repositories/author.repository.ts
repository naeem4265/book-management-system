import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { PaginatedResult, Pagination } from 'src/common/types/pagination.types';

@Injectable()
export class AuthorRepository extends Repository<Author> {
  constructor(dataSource: DataSource) {
    super(Author, dataSource.createEntityManager());
  }

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const author = this.create(createAuthorDto);
    return this.save(author);
  }

  async getAllAuthors(paginationQuery: PaginationParamsDto): Promise<PaginatedResult<Author>> {
    try {
      const { limit, page, search } = paginationQuery;

      const queryBuilder = this.createQueryBuilder('author');

      if (search?.trim()) {
        const searchTerm = `%${search.trim()}%`;
        queryBuilder.andWhere('(author.firstName ILIKE :searchTerm OR author.lastName ILIKE :searchTerm)', {
          searchTerm,
        });
      }

      if (limit && page) {
        queryBuilder.skip((page - 1) * limit).take(limit);
      } else if (limit) {
        queryBuilder.take(limit);
      }
      queryBuilder.orderBy('author.createdAt', 'DESC');

      const [authors, totalItems] = await queryBuilder.getManyAndCount();

      const pagination: Pagination = {
        totalItems,
        currentPage: limit ? (page ?? 1) : undefined,
        totalPages: limit ? Math.ceil(totalItems / limit) : undefined,
        itemsPerPage: limit ?? undefined,
        hasNextPage: !!limit && (page ?? 1) * limit < totalItems,
        hasPreviousPage: !!limit && (page ?? 1) > 1,
      };

      return {
        data: authors,
        pagination,
      };
    } catch (error) {
      throw new Error(`Failed to fetch authors: ${error.message}`);
    }
  }

  async getAuthorById(id: string): Promise<Author | null> {
    return this.findOneBy({ id });
  }

  async updateAuthorById(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.preload({
      id,
      ...updateAuthorDto,
    });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    await this.save(author);
    return author;
  }

  async deleteAuthorById(id: string): Promise<void> {
    const result = await this.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
  }
}
