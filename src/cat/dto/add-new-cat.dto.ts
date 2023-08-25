import { IsString, IsNumber, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

class AddNewCatDto {
  @IsNotEmpty() // Cat should have a name
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100) // Cats cant outlive humans
  age?: number;
}

export default AddNewCatDto;
