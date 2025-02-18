import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'profile_pictures', 
    format: file.mimetype.split('/')[1], 
    public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
  }),
});

const chatFileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'chat_files', 
    public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
  }),
});

const uploadProfile = multer({ storage: profileStorage });
const uploadChatFile = multer({ storage: chatFileStorage });

export { uploadProfile, uploadChatFile };






// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { v2 as cloudinary } from 'cloudinary';

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => ({
//     folder: 'profile_pictures',
//     format: 'jpg',
//     public_id: file.originalname.split('.')[0], 
//   }),
// });

// const upload = multer({ storage });
// export default upload;
