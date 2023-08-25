import { Test, TestingModule } from "@nestjs/testing";
import CatService from "./cat.service";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("CatService", () => {
  let catService: CatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatService],
    }).compile();

    catService = module.get<CatService>(CatService);
  });

  describe("addNewCat", () => {
    it("should add a new cat", () => {
      const newCat = { name: "Whiskers", age: 3 };
      const result = catService.addNewCat(newCat);

      expect(result).toEqual({
        id: expect.any(Number),
        name: newCat.name,
        age: newCat.age,
        imageIds: [],
      });
    });

  });

  describe("addCatImages", () => {
    it("should add images to an existing cat", () => {
      const { id: existingCatId } = catService.addNewCat({
        name: "newCat",
        age: 2,
      });

      const files: Express.Multer.File[] = [
        {
          fieldname: "cat1.jpg",
          originalname: "cat1.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          buffer: Buffer.from("fake buffer"),
          size: 200000,
          stream: undefined,
          destination: undefined,
          filename: undefined,
          path: undefined,
        },
      ];

      // Add images to the existing cat
      const result = catService.addCatImages(Number(existingCatId), files);

      expect(result).toEqual([expect.any(Number)]);
    });

    it("should throw an error if the cat does not exist", () => {
      const nonExistingCatId = 999; // Assuming cat with id 999 does not exist
      const files: any[] = [];

      // Ensure that adding images to a non-existing cat throws an error
      expect(() => catService.addCatImages(nonExistingCatId, files)).toThrow(
        HttpException
      );
    });
  });

  describe("deleteCat", () => {
    it("should delete an existing cat", () => {
      // Prepare an existing cat
      const { id: existingCatId } = catService.addNewCat({
        name: "newCat",
        age: 2,
      });

      // Delete the existing cat and check the return value
      const result = catService.deleteCat(existingCatId);

      expect(result).toBe(true); // The cat should have been deleted
    });

    it("should return false if the cat does not exist", () => {
      const nonExistingCatId = 999; // Assuming cat with id 999 does not exist

      // Delete a non-existing cat and check the return value
      const result = catService.deleteCat(nonExistingCatId);

      expect(result).toBe(false); // The cat does not exist, so deletion should fail
    });
  });

  describe("deleteCatImageById", () => {
    it("should delete an existing cat image", () => {
      const newCat = { name: "Fluffy", age: 2 };
      const files: Express.Multer.File[] = [
        {
          fieldname: "cat1.jpg",
          originalname: "cat1.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          buffer: Buffer.from("fake buffer"),
          size: 200000,
          stream: undefined,
          destination: undefined,
          filename: undefined,
          path: undefined,
        },
      ];
      const { id: catId } = catService.addNewCat(newCat);
      const imageIds = catService.addCatImages(catId, files);

      // Delete the existing cat image and check the return value
      const result = catService.deleteCatImageById(imageIds[0]);

      expect(result).toBe(true); // The cat image should have been deleted
    });

    it("should return false if the cat image does not exist", () => {
      const nonExistingCatImageId = 999; // Assuming cat image with id 999 does not exist

      // Delete a non-existing cat image and check the return value
      const result = catService.deleteCatImageById(nonExistingCatImageId);

      expect(result).toBe(false); // The cat image does not exist, so deletion should fail
    });
  });

  describe("updateCat", () => {
    it("should update an existing cat", () => {
      // Prepare an existing cat and update information
      const { id: existingCatId } = catService.addNewCat( { name: "Fluffy", age: 2 });
      const updatedCatInfo = {
        id: existingCatId,
        name: "Updated Name",
        age: 4,
      };

      // Update the existing cat and check the return value
      const result = catService.updateCat(updatedCatInfo);

      expect(result).toEqual({
        id: existingCatId,
        name: updatedCatInfo.name,
        age: updatedCatInfo.age,
        imageIds: expect.any(Array),
      });
    });

    it("should throw an error if the cat does not exist", () => {
      const nonExistingCatInfo = { id: 999, name: "Updated Name", age: 4 }; // Assuming cat with id 999 does not exist

      // Ensure that updating a non-existing cat throws an error
      expect(() => catService.updateCat(nonExistingCatInfo)).toThrow(
        HttpException
      );
    });
  });

  describe("updateCatImageById", () => {
    it("should update an existing cat image", () => {
      // Prepare an existing cat image and updated image data
      const newCat = { name: "Fluffy", age: 2 };
      const files: Express.Multer.File[] = [
        {
          fieldname: "cat1.jpg",
          originalname: "cat1.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          buffer: Buffer.from("fake buffer"),
          size: 200000,
          stream: undefined,
          destination: undefined,
          filename: undefined,
          path: undefined,
        },
      ];
      const { id: catId } = catService.addNewCat(newCat);
      const imageIds = catService.addCatImages(catId, files);
      const updatedImageData: Express.Multer.File = {
        fieldname: "updatedImageFieldname",
        originalname: "updatedImage.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        size: 200,
        buffer: Buffer.from("updatedImageBuffer"),
        stream: undefined,
        destination: undefined,
        filename: undefined,
        path: undefined,
      };

      // Update the existing cat image and check for any errors
      expect(() =>
        catService.updateCatImageById(imageIds[0], updatedImageData)
      ).not.toThrow();
    });

    it("should throw an error if the cat image does not exist", () => {
      const nonExistingCatImageId = 999; // Assuming cat image with id 999 does not exist
      const updatedImageData: Express.Multer.File = {
        fieldname: "updatedImageFieldname",
        originalname: "updatedImage.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        size: 200,
        buffer: Buffer.from("updatedImageBuffer"),
        stream: undefined,
        destination: undefined,
        filename: undefined,
        path: undefined,
      };

      // Ensure that updating a non-existing cat image throws an error
      expect(() =>
        catService.updateCatImageById(nonExistingCatImageId, updatedImageData)
      ).toThrow(HttpException);
    });
  });

  describe("getCatImageById", () => {
    it("should return an existing cat image", () => {
      const newCat = { name: "Fluffy", age: 2 };
      const files: Express.Multer.File[] = [
        {
          fieldname: "cat1.jpg",
          originalname: "cat1.jpg",
          encoding: "7bit",
          mimetype: "image/jpeg",
          buffer: Buffer.from("fake buffer"),
          size: 200000,
          stream: undefined,
          destination: undefined,
          filename: undefined,
          path: undefined,
        },
      ];
      const { id: catId } = catService.addNewCat(newCat);
      const imageIds = catService.addCatImages(catId, files);

      // Get the existing cat image and check the return value
      const result = catService.getCatImageById(imageIds[0]);

      expect(result).toBeDefined(); // The cat image should exist
    });

    it("should throw an error if the cat image does not exist", () => {
      const nonExistingCatImageId = 999; // Assuming cat image with id 999 does not exist

      // Ensure that trying to get a non-existing cat image throws an error
      expect(() => catService.getCatImageById(nonExistingCatImageId)).toThrow(
        HttpException
      );
    });
  });

  describe("getListOfCatImages", () => {
    it("should return a list of cat images without pagination", () => {
      // Get the list of cat images without pagination
      const result = catService.getListOfCatImages();

      expect(result).toEqual(expect.arrayContaining([])); // The result should be an empty array
    });

    // TODO: @Kshitij add more tests for pagination
  });

  describe("getListOfCats", () => {
    it("should return a list of cats without pagination", () => {
      // Get the list of cats without pagination
      const result = catService.getListOfCats();

      expect(result).toEqual(expect.arrayContaining([])); // The result should be an empty array
    });

    // TODO: @Kshitij add more tests for pagination
  });
});
