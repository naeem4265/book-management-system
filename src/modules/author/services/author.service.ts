import { Injectable, Logger } from '@nestjs/common';
import { CreateAuthorDto } from '../dtos/create-author.dto';

@Injectable()
export class AuthorService {
  private logger: Logger;
  constructor() {
    this.logger = new Logger(AuthorService.name);
  }
  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<string> {
    this.logger.log('Creating author');

    try {
      console.log('createAuthorDto: ', createAuthorDto);
      return 'This action adds a new author';
    } catch (error) {
      this.logger.error('Error creating author', error);
      throw error;
    }
  }
}
