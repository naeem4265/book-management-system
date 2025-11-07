import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthorService } from '../services/author.service';
    import { CreateAuthorDto } from '../dtos/create-author.dto';
    import { ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @ApiOperation({ summary: 'Post author' })
  @ApiBody({ type: CreateAuthorDto })
  @ApiResponse({
    status: 200,
    description: 'Author successfully created.',
  })

  async createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.createAuthor(createAuthorDto);
  }
}
