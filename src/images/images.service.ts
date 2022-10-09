import { Injectable } from '@nestjs/common';
import { stat, unlink, unlinkSync } from 'fs';

@Injectable()
export class ImagesService {
  public update(image: string, update: string) {
    try {
      stat('./upload/' + update, function (err, stats) {
        if (err) return;
        unlinkSync('upload/' + update);
      });
      return image;
    } catch (e) {
      console.log(e);
    }
  }

  public delete(remove: string) {
    try {
      unlinkSync('upload/' + remove);
      return { message: 'Deleted image...' };
    } catch (e) {
      console.log(e);
    }
  }
}
