import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiProduces,
} from "@nestjs/swagger";
import { Response } from "express";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import CatService from "./cat.service"; // Assumed path to service
import AddNewCatDto from "./dto/add-new-cat.dto";
import UpdateCatDto from "./dto/update-cat-dto";
import ListItemDto from "./dto/list-items.dto";
import CatImage from "./entity/cat-image.entity";
import Cat from "./entity/cat.entity";

@Controller("cats")
export class CatController {
  constructor(private readonly catService: CatService) {}

  private ALLOWED_IMG_EXT = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  private FILE_SIZE_LIMIT_MB = 5 * 1024 * 1024; // 5 Mb

  private validateFiles(files: Array<Express.Multer.File>) {
    files.forEach((file) => {
      const { size, mimetype, originalname } = file;

      if (!this.ALLOWED_IMG_EXT.includes(mimetype)) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Invalid file format of ${originalname}, these are the allowed image formats: ${this.ALLOWED_IMG_EXT.join(
              ", "
            )}`,
          },
          HttpStatus.BAD_REQUEST
        );
      }

      if (size > this.FILE_SIZE_LIMIT_MB) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `File too large, size upto 5MB is supported`,
          },
          HttpStatus.BAD_REQUEST
        );
      }
    });
  }

  @Post("addNewCat")
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({ summary: "Add a new cat with images" })
  @ApiConsumes("multipart/form-data")
  @ApiProduces("application/json")
  @ApiResponse({ status: HttpStatus.OK, description: "Cat added successfully" })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "Fluffy" },
        age: { type: "number", example: 3 },
        files: { type: "array", items: { type: "string", format: "binary" } },
      },
      required: ["name"],
    },
    description: "Cat data",
  })
  addNewCat(
    @Body() addNewCatDto: AddNewCatDto,
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): Record<string, string | number | number[]> {
    if (files) {
      this.validateFiles(files); // throws exception
    }
    return this.catService.addNewCat(addNewCatDto, files);
  }

  @Post("addNewCatImages/:catId")
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({ summary: "Add new images to a cat by catId" })
  @ApiConsumes("multipart/form-data")
  @ApiProduces("application/json")
  @ApiParam({ name: "catId", type: Number }) // Specify catId as a parameter
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Images added to cat successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  addNewCatImages(
    @Param() params: any,
    @UploadedFiles() files?: Array<Express.Multer.File>
  ): number[] {
    if (!params.catId || Number.isNaN(Number(params.catId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Please provide a valid number for cat id`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const catId = Number(params.catId);

    if (!files || files.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Please provide an image to update, did not receive image`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    this.validateFiles(files); // throws exception

    return this.catService.addCatImages(catId, files);
  }

  @Delete("deleteCatById/:catId")
  @ApiOperation({ summary: "Delete a cat by catId" })
  @ApiProduces("application/json")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cat deleted successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiParam({ name: "catId", type: Number }) // Specify catId as a parameter
  deleteCatById(@Param() params: any): boolean {
    if (!params.catId || Number.isNaN(Number(params.catId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Please provide a valid number for cat id`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const catId = Number(params.catId);
    return this.catService.deleteCat(catId);
  }

  @Delete("deleteCatImageById/:catImageId")
  @ApiOperation({ summary: "Delete a cat image by its Id" })
  @ApiProduces("application/json")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cat Image deleted successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiParam({ name: "catImageId", type: Number }) // Specify catId as a parameter
  deleteCatImageById(@Param() params: any): boolean {
    if (!params.catImageId || Number.isNaN(Number(params.catImageId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Please provide a valid number for cat image id`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const catImageId = Number(params.catImageId);
    return this.catService.deleteCatImageById(catImageId);
  }

  @Put("updateCat")
  @ApiOperation({ summary: "Update a cat" })
  @ApiProduces("application/json")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cat updated successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        id: { type: "number", example: 1 },
        name: { type: "string", example: "Whiskers" },
        age: { type: "number", example: 4 },
      },
      required: ["id"],
    },
    description: "Cat data",
  })
  updateCat(
    @Body() updateCatDto: UpdateCatDto
  ): Record<string, string | number | number[]> {
    return this.catService.updateCat(updateCatDto);
  }

  @Put("updateCatImageById/:catImageId")
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({ summary: "Update a cat image by catImageId" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cat image updated successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "catImageId", type: Number })
  @ApiBody({ type: "file", description: "Image file" })
  updateCatImageById(
    @Param() params: any,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    if (!params.catImageId || Number.isNaN(Number(params.catImageId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Please provide a valid number for cat image id`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const catImageId = Number(params.catImageId);

    if (!files || files.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Please provide an image to update, did not receive image`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (files.length > 1) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Please send only one file to update`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    this.validateFiles(files); // throws exception

    return this.catService.updateCatImageById(catImageId, files[0]);
  }

  @Get("listCatImages")
  @ApiOperation({ summary: "List cat images" })
  @ApiProduces("application/json")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of cat images retrieved successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiParam({ name: "limit", type: Number, required: false })
  @ApiParam({ name: "offset", type: Number, required: false })
  listCatImages(@Param() params: ListItemDto): CatImage[] {
    const { limit, offset } = params;
    return this.catService.getListOfCatImages(limit, offset);
  }

  @Get("listCats")
  @ApiOperation({ summary: "List cats" })
  @ApiProduces("application/json")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of cats retrieved successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiParam({ name: "limit", type: Number, required: false })
  @ApiParam({ name: "offset", type: Number, required: false })
  listCats(
    @Param() params: ListItemDto
  ): Array<Record<string, string | number | number[]>> {
    const { limit, offset } = params;
    return this.catService.getListOfCats(limit, offset);
  }

  @Get("downloadCatImageById/:catImageId")
  @ApiOperation({ summary: "Download a cat image by catImageId" })
  @ApiProduces("application/octet-stream")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Cat image downloaded successfully",
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Bad request" })
  @ApiParam({ name: "catImageId", type: Number }) // Specify the actual mimetype of the image
  downloadCatImageById(@Param() params: any, @Res() response: Response) {
    if (!params.catImageId || Number.isNaN(Number(params.catImageId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Please provide a valid number for cat image id`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    const catImageId = Number(params.catImageId);
    const { buffer, mimetype, originalName } =
      this.catService.getCatImageById(catImageId);

    response.setHeader("Content-Length", buffer.length);
    response.setHeader("Content-Type", mimetype);
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=${originalName}`
    );

    response.send(buffer);
  }
}
