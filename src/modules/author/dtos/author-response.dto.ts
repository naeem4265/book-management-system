import { Expose } from 'class-transformer';

export class AuthorResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  bio: string;

  @Expose()
  birthDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
