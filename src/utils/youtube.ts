// Node
import fs from 'fs';
import path from 'path';

// Youtube
import youtube from 'ytdl-core';

// Utils
import { videoUtil } from '@utils/video';

export const youtubeUtil = {
    downloadVideo: async (videoUrl: string, cb: () => any, type: string = 'mp3', videoStoragePath: string[] = [], index?: number) => {
        const typesItag: any = {
            mp3: {
                ext: 'mp3',
                itag: '140',
            },
            mp4: {
                ext: 'mp4',
                itag: '18',
            },
        };
        if (!typesItag[type]) {
            type = 'mp3'
        }
        if (videoStoragePath.length <= 0) {
            videoStoragePath!.push("videos");
        } else {
            videoStoragePath!.unshift("playlists");
        };

        let videoFilePath: string | undefined;
        try {
            const { videoDetails: videoData } = await youtube.getBasicInfo(videoUrl)
            const videoTitle = videoUtil.transformVideoTitle(videoData.title);


            videoFilePath = path.resolve('saves', ...videoStoragePath);

            if (!fs.existsSync(videoFilePath)) {
                fs.mkdirSync(videoFilePath);
            }

            videoFilePath = `${videoFilePath}/${(index) ? `${index} ` : ''}${videoTitle}.${typesItag[type].ext}`;

            youtube(videoUrl, { quality: typesItag[type].itag, })
                .pipe(fs.createWriteStream(videoFilePath))
                .addListener('finish', cb);
        } catch (err) {
            if (videoFilePath) fs.unlinkSync(videoFilePath);
            console.log(err);
            throw new Error(err);
        }
    },
};