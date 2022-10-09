import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Ads, AdsSchema } from './schemas/ads.schema';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: Ads.name, schema: AdsSchema }]),
    AuthModule,
  ],
  controllers: [AdsController],
  providers: [AdsService],
})
export class AdsModule {}
