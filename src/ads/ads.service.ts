import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Ads, AdsDocument } from './schemas/ads.schema';
import { AdsDto } from './dto/ads.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(Ads.name) private ads: Model<AdsDocument>,
    private authService: AuthService,
  ) {}

  public async createAds(adsDto: AdsDto) {
    try {
      adsDto.dateCreated = new Date(Date.now()).toUTCString();
      await new this.ads(adsDto).save();
      this.authService.updateUserIsAds(adsDto.userId, true);
      return { message: 'Craeted ads...' };
    } catch (e) {
      console.log(e);
    }
  }

  public async putAds(adsDto: AdsDto, userId: string) {
    try {
      await this.ads.updateOne({ userId }, { $set: adsDto }, { upsert: true });
      return { message: 'Updated ads...' };
    } catch (e) {
      console.log(e);
    }
  }

  public async getAdsById(id: string, userId: string) {
    try {
      let ads: any;
      if (id) ads = await this.ads.findById({ _id: id });
      else if (id) ads = await this.ads.findById({ userId });
      return ads;
    } catch (e) {
      console.log(e);
    }
  }

  public async getAdsAll() {
    try {
      const ads: any = await this.ads.find();
      return ads;
    } catch (e) {
      console.log(e);
    }
  }

  public async deleteAds(id: string) {
    try {
      await this.ads.deleteOne({ _id: id });
      return { message: 'Deleted ads...' };
    } catch (e) {
      console.log(e);
    }
  }
}
