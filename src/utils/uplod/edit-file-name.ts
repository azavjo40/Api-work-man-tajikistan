export const editFileName = (req: any, file: any, cb: any) => {
  const date = Date.now();
  cb(null, `${date}-${file.originalname}`);
};
