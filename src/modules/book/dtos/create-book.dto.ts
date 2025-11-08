import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsISBN, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    example: 'The Great Novel',
    description: 'Title of the book',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '978-3-16-148410-0',
    description: 'ISBN of the book',
    required: true,
  })
  @IsISBN()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Published date of the book',
    required: false,
  })
  @IsDate()
  @IsOptional()
  publishedDate?: Date;

  @ApiProperty({
    example: 'Fantasy',
    description: 'Genre of the book',
    required: false,
  })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the author (must be a valid UUID)',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
