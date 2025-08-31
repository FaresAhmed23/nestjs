import { IsString, IsArray, IsNumber, Min, Max, ArrayMinSize } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  countriesSupported: string[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  servicesOffered: string[];

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNumber()
  @Min(1)
  responseSlaHours: number;
}
