class CatImage {
  constructor(
    public id: number,
    public fieldName: string,
    public originalName: string,
    public mimetype: string,
    public size: number,
    public buffer: Buffer,
    public catId: number,
  ) {}
}

export default CatImage;
