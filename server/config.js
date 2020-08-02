require('dotenv').config();

module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    AWS:{
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
        BUCKET_NAME: process.env.BUCKET_NAME
    }
}


