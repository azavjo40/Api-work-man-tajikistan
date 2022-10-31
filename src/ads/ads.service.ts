import { ImagesService } from './../images/images.service';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Ads, AdsDocument } from './schemas/ads.schema';
import { AdsDto } from './dto/ads.dto';
import { AuthService } from 'src/auth/auth.service';
import { HttpService } from '@nestjs/axios';
import { map, Observable, filter, async } from 'rxjs';

@Injectable()
export class AdsService {
  constructor(
    @InjectModel(Ads.name) private ads: Model<AdsDocument>,
    private authService: AuthService,
    private imagesService: ImagesService,
    private readonly http: HttpService,
  ) {}

  public async createAds(adsDto: AdsDto) {
    try {
      const ads = await this.ads.findOne({ userId: adsDto?.userId });
      if (ads) return { message: 'You have ads...' };
      if (adsDto.userId) {
        adsDto.dateCreated = new Date(Date.now()).toUTCString();
        adsDto.dateUpdate = new Date(Date.now()).toUTCString();
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
      delete adsDto.images;
      adsDto.dateUpdate = new Date(Date.now()).toUTCString();
      await this.ads.updateOne({ userId }, { $set: adsDto }, { upsert: true });
      return { message: 'Updated ads...' };
    } catch (e) {
      console.log(e);
    }
  }

  public async putAdsImage(url: string, userId: string) {
    try {
      const ads = await this.ads.findOne({ userId });
      if (!ads) return { message: 'You do not have ads...' };
      await this.ads.updateOne(
        { userId },
        { $set: { images: [...ads.images, 'upload/' + url] } },
        { upsert: true },
      );
      return { message: 'Updated image...' };
    } catch (e) {
      console.log(e);
    }
  }

  public async DeleteAdsImage(url: string, userId: string) {
    try {
      this.imagesService.delete(url);
      const ads = await this.ads.findOne({ userId });
      if (!ads) return { message: 'You do not have ads...' };
      await this.ads.updateOne(
        { userId },
        {
          $set: {
            images: [
              ...ads.images.filter((img: any) => img !== 'upload/' + url),
            ],
          },
        },
        { upsert: true },
      );
      return { message: 'Updated delete...' };
    } catch (e) {
      console.log(e);
    }
  }

  public async getAdsById(_id: string, query: any) {
    try {
      if (query?.isIntegrtion == 'true') {
        const dataSomon = await this.integrtionAdsSomonGetById(_id).toPromise();
        return dataSomon;
      }
      const ads: AdsDto = await this.ads.findOne({ _id });
      const user = await this.authService.getUserById(ads.userId);
      const adsResuls = { ads: ads, user };
      if (ads) return adsResuls;
      return { message: 'Not found ads...' };
    } catch (e) {
      console.log(e);
    }
  }

  public integrtionAdsSomonGetById(_id: string): Observable<any> {
    try {
      return this.http.get(`https://somon.tj/api/items/${_id}/`).pipe(
        map((item: any) => {
          return {
            ads: {
              title: item?.data?.title,
              city: item?.data?.city,
              description: item?.data?.templated_title,
              skils: [...item?.data?.breadcrumbs.map((item: any) => item.name)],
              userId: item?.data?.user?.id,
              _id: item?.data?.id,
              images: item?.data?.images?.map((item: any) => item.url),
              isPublish: true,
              dateCreated: item?.data?.created_dt,
              dateUpdate: item?.data?.created_dt,
              isIntegrtion: true,
              detailUrl: item?.data?.detail_url?.split('/')[2],
            },
            user: {
              image: item?.data?.images[0]?.url
                ? item?.data?.images[0]?.url
                : 'assets/icons/avatar-user.png',
              isAds: true,
              name: item?.data?.user?.name,
              username: item?.data?.contacts[0]?.phone
                ? item?.data?.contacts[0]?.phone
                : item?.data?.user?.phone,
              _id: item?.data?.user?.id,
              isIntegrtion: true,
            },
          };
        }),
      );
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

  public async getAdsAll(query: any) {
    try {
      let ads: any = await this.ads.find();
      const dataSomon = await this.integrtionAdsSomonGetAll().toPromise();
      let adsResuls: any = [];
      for (let i = 0; i < ads.length; i++) {
        const user = await this.authService.getUserById(ads[i].userId);
        adsResuls.push({ ads: ads[i], user });
      }
      adsResuls.push(...dataSomon);

      if ((query?.page, query?.perPage)) {
        const page = Number(query.page);
        const perPage = Number(query.perPage);
        if (adsResuls?.length < perPage) {
          return {
            data: adsResuls,
            total: adsResuls.length,
          };
        }
        return {
          data: adsResuls.splice(page == 1 ? 0 : (page - 1) * perPage, perPage),
          total: adsResuls.length,
        };
      }
      return { data: adsResuls, total: adsResuls.length };
    } catch (e) {
      console.log(e);
    }
  }

  public integrtionAdsSomonGetAll(): Observable<any> {
    try {
      return this.http
        .get(
          'https://m.somon.tj/api/items/mobile_top/biznes-i-uslugi/remontnyie-uslugi',
        )
        .pipe(
          map((item: any) => {
            return item?.data.map((item: any) => {
              return {
                ads: {
                  title: item?.info?.title,
                  city: item?.info?.city,
                  description: item?.info?.templated_title,
                  skils: [
                    ...item?.info?.breadcrumbs.map((item: any) => item.name),
                  ],
                  userId: null,
                  _id: item?.info?.id,
                  images: item?.info?.all_images,
                  isPublish: true,
                  dateCreated: item?.info?.published,
                  dateUpdate: new Date(Date.now()).toUTCString(),
                  isIntegrtion: true,
                  detailUrl: item?.info?.detail_url?.split('/')[2],
                },
                user: {
                  image: item?.info?.first_thumb
                    ? item?.info?.first_thumb
                    : item?.info?.all_images[0]
                    ? item?.info?.all_images[0]
                    : 'assets/icons/avatar-user.png',
                  isAds: true,
                  name: item?.info?.company_name
                    ? item?.info?.company_name
                    : item?.info?.title,
                  username: '',
                  _id: null,
                  isIntegrtion: true,
                },
              };
            });
          }),
        );
    } catch (e) {
      console.log(e);
    }
  }

  public async deleteAds(userId: string) {
    try {
      if (userId) {
        const ads = await this.ads.findOne({ userId });
        ads?.images.map((img: string) => {
          this.imagesService.delete(img.split('upload/')[1]);
        });
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
