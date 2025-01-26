import { v2 as cloudinary } from 'cloudinary';
import { CLOUDNAME, APIKEY, APISECRET } from './env';


cloudinary.config({
  cloud_name: CLOUDNAME,
  api_key: APIKEY,
  api_secret: APISECRET,
})

export default cloudinary
