import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationParamsDto } from 'src/common/dto/pagination-params.dto';

export class BookQueryDto extends PaginationParamsDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Filter by author ID (must be a valid UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'authorId must be a valid UUID' })
  authorId?: string;
}
