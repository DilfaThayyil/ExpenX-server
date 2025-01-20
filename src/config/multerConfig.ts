import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinaryConfig";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
      folder: "profile_images", 
      format: file.mimetype.split('/')[1], 
      public_id: `profile_${Date.now()}`,
    }),
  });
  

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
  
export default upload;
