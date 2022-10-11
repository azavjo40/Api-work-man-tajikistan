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
      const ads = await this.ads.findOne({ userId: adsDto?.userId });
      if (ads) return { message: 'You have ads...' };
      if (adsDto.userId) {
        adsDto.dateCreated = new Date(Date.now()).toUTCString();
        await new this.ads(adsDto).save();
        await this.authService.updateUserIsAds(adsDto.userId, true);
        return { message: 'Craeted ads...' };
      }
      return { message: 'Is not user id...' };
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

  public async getAdsById(_id: string) {
    try {
      const ads: AdsDto = await this.ads.findOne({ _id });
      const user = await this.authService.getUserById(ads.userId);
      const adsResuls = { ads: ads, user };
      if (ads) return adsResuls;
      return { message: 'Not found ads...' };
    } catch (e) {
      console.log(e);
    }
  }

  public async getAdsByIdUser(userId: string) {
    try {
      const ads: AdsDto = await this.ads.findOne({ userId });
      const user = await this.authService.getUserById(ads.userId);
      const adsResuls = { ads: ads, user };
      if (ads) return adsResuls;
      return { message: 'Not found ads...' };
    } catch (e) {
      console.log(e);
    }
  }

  public async getAdsAll() {
    try {
      let ads: any = await this.ads.find();
      const adsResuls = [];
      ads = [
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
        ...ads,
      ];
      for (let i = 0; i < ads.length; i++) {
        const user = await this.authService.getUserById(ads[i].userId);
        adsResuls.push({ ads: ads[i], user });
      }
      return adsResuls;
    } catch (e) {
      console.log(e);
    }
  }

  public async deleteAds(userId: string) {
    try {
      if (userId) {
        await this.ads.deleteOne({ userId });
        await this.authService.updateUserIsAds(userId, false);
        return { message: 'Deleted ads...' };
      }
      return { message: 'Not Auth...' };
    } catch (e) {
      console.log(e);
    }
  }
}
