import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'profile_pictures',
    format: 'jpg',
    public_id: file.originalname.split('.')[0], 
  }),
});

const upload = multer({ storage });
export default upload;
