import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateChurchProfileDto {
  @IsString()
  @MinLength(1)
  churchName: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
