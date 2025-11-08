import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsISBN, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateBookDto {
  @ApiProperty({
    example: 'The Great Novel',
    description: 'Title of the book',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: '978-0-306-40615-7',
    description: 'ISBN of the book',
    required: false,
  })
  @IsISBN()
  @IsOptional()
  isbn?: string;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Published date of the book',
    required: false,
  })
  @IsOptional()
  publishedDate?: Date;

  @ApiProperty({
    example: 'Sci-Fi',
    description: 'Genre of the book',
    required: false,
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the author',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  authorId?: string;
}
