import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from '../services/author.service';

describe('AuthorController', () => {
  let controller: AuthorController;
  let service: jest.Mocked<AuthorService>;

  const mockAuthorService = {
    createAuthor: jest.fn(),
    getAllAuthors: jest.fn(),
    getAuthorById: jest.fn(),
    updateAuthorById: jest.fn(),
    deleteAuthorById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorService,
          useValue: mockAuthorService,
        },
      ],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
    service = module.get(AuthorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
