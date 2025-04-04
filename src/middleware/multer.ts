import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';


const getFileFormat = (mimetype: string):string => {
  const map: { [key: string]: string } = {
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/csv': 'csv',
    'image/png': 'png',
    'image/jpeg': 'jpg',
  };

  return map[mimetype] || 'raw'; 
};

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

const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const rawFormats = ["csv", "xlsx", "docx", "pdf"]; 
    const format = getFileFormat(file.mimetype);
    return {
      folder: "documents",
      format: format, 
      public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
      resource_type: rawFormats.includes(format) ? "raw" : "auto" 
    };
  },
});


const uploadProfile = multer({ storage: profileStorage });
const uploadChatFile = multer({ storage: chatFileStorage });
const uploadDocument = multer({ storage: documentStorage })

export { uploadProfile, uploadChatFile, uploadDocument };