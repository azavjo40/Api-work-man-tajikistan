import { editFileName } from './edit-file-name';
import { imageFilter } from './image-filter';
import { diskStorage } from 'multer';

export const imageDiskStorage = {
  storage: diskStorage({
    destination: './upload',
    filename: editFileName,
  }),
  fileFilter: imageFilter,
};
