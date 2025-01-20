import { v2 as cloudinary } from "cloudinary";
import { APIKEY, APISECRET, CLOUDNAME } from "./env";


cloudinary.config({
    cloud_name: CLOUDNAME,
    api_key: APIKEY,
    api_secret: APISECRET
})

export default cloudinary