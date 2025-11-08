import { Body, Controller, Post, UseInterceptors, ClassSerializerInterceptor, HttpStatus } from '@nestjs/common';
import { BookService } from '../services/book.service';
import { CreateBookDto } from '../dtos/create-book.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

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
}
