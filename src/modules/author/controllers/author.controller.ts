import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { AuthorService } from '../services/author.service';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Authors')
@Controller('authors')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @ApiOperation({ summary: 'Post author' })
  @ApiBody({ type: CreateAuthorDto })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async getAllAuthors() {
    return this.authorService.getAllAuthors();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get author by id' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Author not found' })
  async getAuthorById(@Param('id') id: string) {
    return this.authorService.getAuthorById(id);
  }
}
