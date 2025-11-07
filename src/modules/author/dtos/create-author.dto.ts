import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'John',
    description: 'First name of the author',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the author',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Bio of the author',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({
    example: '2020-01-01',
    description: 'Birth date of the author',
    required: false,
  })
  @IsOptional()
  birthDate?: Date;
}
