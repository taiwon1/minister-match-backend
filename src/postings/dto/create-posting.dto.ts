import { IsArray, IsDateString, IsOptional, IsString, ArrayNotEmpty, MinLength } from 'class-validator';

export class CreatePostingDto {
  @IsDateString()
  serviceDate: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  neededInstruments: string[];

  @IsString()
  @MinLength(1)
  location: string;

  @IsOptional()
  @IsString()
  guideNote?: string;
}
