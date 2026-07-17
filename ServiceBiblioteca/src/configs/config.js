import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3006,
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'biblioteca/profiles',
    baseUrl: process.env.CLOUDINARY_BASE_URL,
    defaultAvatar: process.env.CLOUDINARY_DEFAULT_AVATAR_FILENAME
  }
};
