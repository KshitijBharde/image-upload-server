import { IsNumber, IsNotEmpty } from 'class-validator';
import AddNewCatDto from './add-new-cat.dto';

class UpdateCatDto extends AddNewCatDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

export default UpdateCatDto;
