import { Expose, Type } from 'class-transformer';
import { AuthorResponseDto } from '../../author/dtos/author-response.dto';

export class BookResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  isbn: string;

  @Expose()
  publishedDate: Date;

  @Expose()
  genre: string;

  @Expose()
  @Type(() => AuthorResponseDto)
  author: AuthorResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
