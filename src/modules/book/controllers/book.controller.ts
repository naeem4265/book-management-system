import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Param,
  Delete,
  Patch,
  Get,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDto } from '../dtos/create-book.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { BookQueryDto } from '../dtos/book-query.dto';

@ApiTags('Books')
@Controller('books')
@UseInterceptors(ClassSerializerInterceptor)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Author does not exist or validation failed',
  })
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination, search, and filtering' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async getAllBooks(@Query() query: BookQueryDto) {
    return this.bookService.getAllBooks(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Book ID (must be a valid UUID)' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request - Invalid UUID format' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  async getBookById(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookService.getBookById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Book ID (must be a valid UUID)' })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request - Invalid UUID format or validation failed',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  async updateBookById(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.updateBookById(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Book ID (must be a valid UUID)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Book deleted successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request - Invalid UUID format' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book not found' })
  async deleteBookById(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.bookService.deleteBookById(id);
  }
}
