import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthorService } from '../services/author.service';
import { CreateAuthorDto } from '../dtos/create-author.dto';
import { UpdateAuthorDto } from '../dtos/update-author.dto';
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

  @Patch(':id')
  @ApiOperation({ summary: 'Update author by id' })
  @ApiBody({ type: UpdateAuthorDto })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Author not found' })
  async updateAuthorById(@Param('id') id: string, @Body() updateAuthorDto: UpdateAuthorDto) {
    return this.authorService.updateAuthorById(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an author by ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Author deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Author not found' })
  async deleteAuthorById(@Param('id') id: string): Promise<void> {
    await this.authorService.deleteAuthorById(id);
  }
}
