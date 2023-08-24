import { IsNumber } from 'class-validator';

class ListItemDto {
  @IsNumber()
  limit?: number;

  @IsNumber()
  offset?: number;
}

export default ListItemDto;
