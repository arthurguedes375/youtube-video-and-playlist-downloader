import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import axios from 'axios';

const youtubeAxios = axios.create({
    baseURL: 'https://youtube.googleapis.com/youtube/v3/',
    params: {
        key: process.env.YOUTUBE_API_SECRET,
    },
    headers: {
        Accept: 'application/json',
    }
})

export default youtubeAxios;