import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from '../dtos/create-author.dto';

@Injectable()
export class AuthorService {
  constructor() {}
  async createAuthor(authorDto: CreateAuthorDto) {
    return 'This action adds a new author';
  }
}
