import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { mongoDb } from './constants/constants';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    MongooseModule.forRoot(mongoDb.url),
    AuthModule,
    ImagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
