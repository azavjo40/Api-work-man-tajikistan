import {
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/core/jwt/jwt-auth.guard';
import { imageDiskStorage } from 'src/utils/uplod/image-disk-stora';
import { ImagesService } from './images.service';

type File = Express.Multer.File;

@Controller('upload')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}
  @Post('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageDiskStorage))
  create(@UploadedFile() file: File) {
    return { url: 'upload/' + file?.filename };
  }

  @Put('/:update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageDiskStorage))
  update(@Param('update') update: string, @UploadedFile() file: File) {
    return this.imagesService.update('upload/' + file?.filename, update);
  }

  @Delete('/:remove')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', imageDiskStorage))
  delete(@Param('remove') remove: string) {
    return this.imagesService.delete(remove);
  }
}
