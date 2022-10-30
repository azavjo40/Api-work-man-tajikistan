import { Injectable } from '@nestjs/common';
import { stat, unlinkSync } from 'fs';

@Injectable()
export class ImagesService {
  public update(image: string, remove: string) {
    try {
      stat('./upload/' + remove, function (err, stats) {
        if (err) return;
        unlinkSync('upload/' + remove);
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
