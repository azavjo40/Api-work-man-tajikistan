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
  putAds(@Body(new ValidationPipe()) adsDto: AdsDto, @Request() req) {
    return this.adsService.putAds(adsDto, req?.user?.id);
  }

  @Get('/:id')
  getAdsById(@Param('id') id: string, @Request() req) {
    return this.adsService.getAdsById(id, req?.user?.id);
  }

  @Get()
  getAdsAll() {
    return this.adsService.getAdsAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteAds(@Param('id') id: string) {
    return this.adsService.deleteAds(id);
  }
}
