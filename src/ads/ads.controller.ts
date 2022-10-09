import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/core/jwt/jwt-auth.guard';
import { AdsService } from './ads.service';
import { AdsDto } from './dto/ads.dto';

@Controller('ads')
export class AdsController {
  constructor(private adsService: AdsService) {}

  @Post()
  createAds(@Body(new ValidationPipe()) adsDto: AdsDto) {
    return this.adsService.createAds(adsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  putAds(@Body() adsDto: any, @Request() req) {
    return this.adsService.putAds(adsDto, req?.user?._id);
  }

  @Get('/:id')
  getAdsById(@Param('id') _id: string) {
    return this.adsService.getAdsById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  getAdsByIdUser(@Request() req) {
    return this.adsService.getAdsByIdUser(req?.user?._id);
  }

  @Get()
  getAdsAll() {
    return this.adsService.getAdsAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteAds(@Request() req) {
    return this.adsService.deleteAds(req?.user?._id);
  }
}
