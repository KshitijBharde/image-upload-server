import { Test, TestingModule } from "@nestjs/testing";
import { CatController } from "./cat.controller";
import CatService from "./cat.service";
import AddNewCatDto from "./dto/add-new-cat.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("CatController", () => {
  let catController: CatController;
  let catService: CatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatController],
      providers: [CatService], // Use the actual CatService here
    }).compile();

    catController = module.get<CatController>(CatController);
    catService = module.get<CatService>(CatService);
  });

  describe("addNewCat", () => {
    it("should add a new cat with valid data and images", async () => {
      const addNewCatDto: AddNewCatDto = {
        name: "Fluffy",
        age: 3,
      };

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
          path: undefined
        },
        {
            fieldname: "cat2.jpg",
            originalname: "cat2.jpg",
            encoding: "7bit",
            mimetype: "image/jpeg",
            buffer: Buffer.from("fake buffer"),
            size: 150000,
            stream: undefined,
            destination: undefined,
            filename: undefined,
            path: undefined
          },
      ];

      const expectedResult = {id: 1, name: 'Fluffy', age: 3, imageIds: [1, 2] };


      const result = await catController.addNewCat(addNewCatDto, files);

      expect(result).toEqual(expectedResult);
    });

    it("should add a new cat with valid data but no images", async () => {
      const addNewCatDto: AddNewCatDto = {
        name: "Bob",
        age: 5,
      };

      const expectedResult = {id: 2, name: 'Bob', age: 5, imageIds: [] };

      const result = await catController.addNewCat(addNewCatDto);

      expect(result).toEqual(expectedResult);
    });
  });

  // TODO: @Kshitij Add tests for other controller methods
});
