import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorRepository } from '../repositories/author.repository';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';
import { Author } from '../entities/author.entity';

describe('AuthorService', () => {
  let service: AuthorService;
  let repository: jest.Mocked<AuthorRepository>;

  const mockAuthor: Author = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'A famous author',
    birthDate: new Date('1980-01-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    books: [],
  };

  const mockAuthorResponse = {
    id: mockAuthor.id,
    firstName: mockAuthor.firstName,
    lastName: mockAuthor.lastName,
    bio: mockAuthor.bio,
    birthDate: mockAuthor.birthDate,
    createdAt: mockAuthor.createdAt,
    updatedAt: mockAuthor.updatedAt,
  };

  const mockAuthorRepository = {
    createAuthor: jest.fn(),
    getAllAuthors: jest.fn(),
    getAuthorById: jest.fn(),
    updateAuthorById: jest.fn(),
    deleteAuthorById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorService,
        {
          provide: AuthorRepository,
          useValue: mockAuthorRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorService>(AuthorService);
    repository = module.get(AuthorRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAuthor', () => {
    it('should create an author successfully', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
        bio: 'A famous author',
        birthDate: new Date('1980-01-01'),
      };

      repository.createAuthor.mockResolvedValue(mockAuthor);

      const result = await service.createAuthor(createAuthorDto);

      expect(repository.createAuthor).toHaveBeenCalledWith(createAuthorDto);
      expect(repository.createAuthor).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAuthorResponse);
    });

    it('should throw error when repository fails to create author', async () => {
      const createAuthorDto: CreateAuthorDto = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const error = new Error('Database error');
      repository.createAuthor.mockRejectedValue(error);

      await expect(service.createAuthor(createAuthorDto)).rejects.toThrow('Database error');
      expect(repository.createAuthor).toHaveBeenCalledWith(createAuthorDto);
    });
  });

  describe('getAllAuthors', () => {
    it('should return paginated authors successfully', async () => {
      const paginationQuery: PaginationParamsDto = {
        limit: 10,
        page: 1,
      };

      const mockAuthors: Author[] = [mockAuthor];
      const mockPagination = {
        totalItems: 1,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      repository.getAllAuthors.mockResolvedValue({
        data: mockAuthors,
        pagination: mockPagination,
      });

      const result = await service.getAllAuthors(paginationQuery);

      expect(repository.getAllAuthors).toHaveBeenCalledWith(paginationQuery);
      expect(repository.getAllAuthors).toHaveBeenCalledTimes(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(mockAuthorResponse);
      expect(result.pagination).toEqual(mockPagination);
    });

    it('should return empty array when no authors found', async () => {
      const paginationQuery: PaginationParamsDto = {
        limit: 10,
        page: 1,
      };

      const mockPagination = {
        totalItems: 0,
        currentPage: 1,
        totalPages: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      repository.getAllAuthors.mockResolvedValue({
        data: [],
        pagination: mockPagination,
      });

      const result = await service.getAllAuthors(paginationQuery);

      expect(result.data).toHaveLength(0);
      expect(result.pagination.totalItems).toBe(0);
    });

    it('should handle search query', async () => {
      const paginationQuery: PaginationParamsDto = {
        limit: 10,
        page: 1,
        search: 'John',
      };

      repository.getAllAuthors.mockResolvedValue({
        data: [mockAuthor],
        pagination: {
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      await service.getAllAuthors(paginationQuery);

      expect(repository.getAllAuthors).toHaveBeenCalledWith(paginationQuery);
    });

    it('should throw error when repository fails to get authors', async () => {
      const paginationQuery: PaginationParamsDto = {
        limit: 10,
        page: 1,
      };

      const error = new Error('Database error');
      repository.getAllAuthors.mockRejectedValue(error);

      await expect(service.getAllAuthors(paginationQuery)).rejects.toThrow('Database error');
      expect(repository.getAllAuthors).toHaveBeenCalledWith(paginationQuery);
    });
  });

  describe('getAuthorById', () => {
    it('should return an author by id successfully', async () => {
      const authorId = '123e4567-e89b-12d3-a456-426614174000';

      repository.getAuthorById.mockResolvedValue(mockAuthor);

      const result = await service.getAuthorById(authorId);

      expect(repository.getAuthorById).toHaveBeenCalledWith(authorId);
      expect(repository.getAuthorById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAuthorResponse);
    });

    it('should throw NotFoundException when author is not found', async () => {
      const authorId = 'non-existent-id';

      repository.getAuthorById.mockResolvedValue(null);

      await expect(service.getAuthorById(authorId)).rejects.toThrow(NotFoundException);
      await expect(service.getAuthorById(authorId)).rejects.toThrow('Author with id non-existent-id not found');
      expect(repository.getAuthorById).toHaveBeenCalledWith(authorId);
    });

    it('should throw error when repository fails to get author', async () => {
      const authorId = '123e4567-e89b-12d3-a456-426614174000';

      const error = new Error('Database error');
      repository.getAuthorById.mockRejectedValue(error);

      await expect(service.getAuthorById(authorId)).rejects.toThrow('Database error');
      expect(repository.getAuthorById).toHaveBeenCalledWith(authorId);
    });
  });

  describe('updateAuthorById', () => {
    it('should update an author successfully', async () => {
      const authorId = '123e4567-e89b-12d3-a456-426614174000';
      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'Jane',
        bio: 'Updated bio',
      };

      const updatedAuthor: Author = {
        ...mockAuthor,
        firstName: 'Jane',
        bio: 'Updated bio',
        updatedAt: new Date('2024-01-02'),
      };

      repository.updateAuthorById.mockResolvedValue(updatedAuthor);

      const result = await service.updateAuthorById(authorId, updateAuthorDto);

      expect(repository.updateAuthorById).toHaveBeenCalledWith(authorId, updateAuthorDto);
      expect(repository.updateAuthorById).toHaveBeenCalledTimes(1);
      expect(result.firstName).toBe('Jane');
      expect(result.bio).toBe('Updated bio');
    });

    it('should throw error when repository fails to update author', async () => {
      const authorId = '123e4567-e89b-12d3-a456-426614174000';
      const updateAuthorDto: UpdateAuthorDto = {
        firstName: 'Jane',
      };

      const error = new Error('Database error');
      repository.updateAuthorById.mockRejectedValue(error);

      await expect(service.updateAuthorById(authorId, updateAuthorDto)).rejects.toThrow('Database error');
      expect(repository.updateAuthorById).toHaveBeenCalledWith(authorId, updateAuthorDto);
    });
  });

  describe('deleteAuthorById', () => {
    it('should delete an author successfully', async () => {
      const authorId = '123e4567-e89b-12d3-a456-426614174000';

      repository.deleteAuthorById.mockResolvedValue(undefined);

      await service.deleteAuthorById(authorId);

      expect(repository.deleteAuthorById).toHaveBeenCalledWith(authorId);
      expect(repository.deleteAuthorById).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository fails to delete author', async () => {
      const authorId = '123e4567-e89b-12d3-a456-426614174000';

      const error = new Error('Database error');
      repository.deleteAuthorById.mockRejectedValue(error);

      await expect(service.deleteAuthorById(authorId)).rejects.toThrow('Database error');
      expect(repository.deleteAuthorById).toHaveBeenCalledWith(authorId);
    });
  });
});
