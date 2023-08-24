import ImageFile from './cat-image.entity';

class Cat {
  constructor(
    public id: number,
    public name: string,
    public age?: number,
    public imageIdsSet: Set<number> = new Set(),
  ) {}
}

export default Cat;
