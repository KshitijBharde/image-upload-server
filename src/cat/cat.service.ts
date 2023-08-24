import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import Cat from './entity/cat.entity';
import AddNewCatDto from './dto/add-new-cat.dto';
import CatImage from './entity/cat-image.entity';
import UpdateCatDto from './dto/update-cat-dto';

@Injectable()
class CatService {
  private readonly logger = new Logger('CatsService', { timestamp: true });

  private readonly cats: Map<number, Cat> = new Map();

  private readonly catImages: Map<number, CatImage> = new Map();

  private static catIdCounter = 0; // trying to mimic a auto-generated serial id in DB
  private static imageIdCounter = 0;

  private getNewCatId(): number {
    CatService.catIdCounter += 1;
    return Number(CatService.catIdCounter);
  }

  private getNewImageId(): number {
    CatService.imageIdCounter += 1;
    return Number(CatService.imageIdCounter);
  }

  private createNewCatImages(
    catId: number,
    files: Array<Express.Multer.File>,
  ): CatImage[] {
    return files.map((file) => {
      const { fieldname, originalname, mimetype, size, buffer } = file;

      const id = this.getNewImageId();

      return new CatImage(
        id,
        fieldname,
        originalname,
        mimetype,
        size,
        buffer,
        catId,
      );
    });
  }

  private addNewCatImagesHelper(newCatImages: CatImage[]): number[] {
    newCatImages.forEach((image) => {
      this.catImages.set(image.id, image);
    });

    return newCatImages.map((image) => image.id);
  }

  addNewCat(
    addNewCat: AddNewCatDto,
    files?: Array<Express.Multer.File>,
  ): Record<string, string | number | number[]> {
    const { name, age } = addNewCat;

    const catId = this.getNewCatId();
    const newCatInst = new Cat(catId, name, age);

    let catImageIds: number[] = [];
    if (files) {
      const newCatImages = this.createNewCatImages(catId, files);
      catImageIds = this.addNewCatImagesHelper(newCatImages);
    }

    newCatInst.imageIdsSet = new Set(catImageIds);

    this.cats.set(catId, newCatInst);
    this.logger.debug(`added a new cat with id: ${catId}`);

    return { id: catId, name, age, imageIds: catImageIds };
  }

  addCatImages(catId: number, files: Array<Express.Multer.File>): number[] {
    const existingCatInst = this.cats.get(catId);

    if (!existingCatInst) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Could not find cat with id: ${catId}, please provide a valid id or try adding a new cat`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const newCatImages = this.createNewCatImages(catId, files);
    const newCatImageIds = this.addNewCatImagesHelper(newCatImages);

    newCatImageIds.forEach((id) => {
      existingCatInst.imageIdsSet.add(id);
    });

    this.logger.debug(`added a new images for cat with id: ${catId}`);
    return newCatImageIds;
  }

  deleteCat(catId: number): boolean {
    const catInst = this.cats.get(catId);

    if (!catInst) {
      return false;
    }

    const { imageIdsSet } = catInst;

    imageIdsSet.forEach((id) => {
      this.catImages.delete(id);
    }); // In a relational DB cascade delete would have handled it

    this.cats.delete(catId);
    this.logger.debug(`deleted a cat with id: ${catId}`);
  }

  deleteCatImageById(catImageId: number): boolean {
    const catImageInst = this.catImages.get(catImageId);

    if (!catImageInst) {
      return false;
    }

    const { catId } = catImageInst;

    this.catImages.delete(catImageId);

    const catInst = this.cats.get(catId);

    catInst.imageIdsSet.delete(catImageId);
    this.logger.debug(`deleted a cat image with id: ${catImageId}`);
  }

  updateCat(updateCatDto: UpdateCatDto): Record<string, string | number | number[]> {
    const { id, name, age } = updateCatDto;

    const catInst = this.cats.get(id);

    if (!catInst) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Could not find cat with id: ${id}, please provide a valid id or try adding a new cat`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    catInst.name = name;
    catInst.age = age;
    this.logger.debug(`updated a cat with id: ${id}`);

    return { id, name, age, imageIds: Array.from(catInst.imageIdsSet) };
  }

  updateCatImageById(catImageId: number, file: Express.Multer.File): void {
    const catImageInst = this.catImages.get(catImageId);

    if (!catImageInst) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Could not find image with id: ${catImageId}, please provide a valid image id or try adding a new one`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const { fieldname, originalname, mimetype, size, buffer } = file;

    catImageInst.fieldName = fieldname;
    catImageInst.originalName = originalname;
    catImageInst.mimetype = mimetype;
    catImageInst.size = size;
    catImageInst.buffer = buffer;
    this.logger.debug(`updated a cat image with id: ${catImageId}`);
  }

  getCatImageById(catImageId: number): CatImage {
    const catImageInst = this.catImages.get(catImageId);

    if (!catImageInst) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Could not find image with id: ${catImageId}, please provide a valid image id`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return catImageInst;
  }

  getListOfCatImages(limit?: number, offset?: number): CatImage[] {
    const catImagesArr = Array.from(this.catImages.values());
    const totalImages = catImagesArr.length;

    if (!limit || !offset) {
      return catImagesArr.map((image) => {
        image.buffer = undefined;
        return image;
      });
    }

    if (offset >= totalImages) {
      return [];
    }

    const endIndex = Math.min(offset + limit, totalImages);
    const catImageRetArray = catImagesArr.slice(offset, endIndex);

    return catImageRetArray.map((image) => {
      image.buffer = undefined;
      return image;
    });
  }

  getListOfCats(
    limit: number = 0,
    offset: number = 0,
  ): Array<Record<string, string | number | number[]>> {
    const catsArr = Array.from(this.cats.values());
    const totalCats = catsArr.length;

    if (!limit || !offset) {
      return catsArr.map((cat) => {
        const { id, imageIdsSet, name, age } = cat;
        return { id, name, age, imageIds: Array.from(imageIdsSet) };
      });
    }

    if (offset >= totalCats) {
      return [];
    }

    const endIndex = Math.min(offset + limit, totalCats);
    const catsRetArray = catsArr.slice(offset, endIndex);

    return catsRetArray.map((cat) => {
      const { id, imageIdsSet, name, age } = cat;
      return { id, name, age, imageIds: Array.from(imageIdsSet) };
    });
  }
}

export default CatService;
