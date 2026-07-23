import { IsArray, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateMinisterProfileDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  instruments: string[];

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
