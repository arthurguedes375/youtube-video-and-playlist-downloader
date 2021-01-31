// Node
import fs from 'fs';
import path from 'path';

// Youtube
import youtube from 'ytdl-core';
import youtubeApi from '@config/youtubeApi';

// Utils
import { videoUtil } from '@utils/video';
import { urlUtil } from '@utils/url';

export const youtubeUtil = {
    downloadPlaylist: async (playlistUrl: string, cb: () => any, playlistName: string, type: string = 'mp3') => {
        try {

            const { list: playlistId } = urlUtil.parseQueryParams(playlistUrl);

            let playlistVideos: string[] = [];

            const getPlaylistContent = async (playlistId: string, pageToken?: string) => {
                try {
                    const { data, status } = await youtubeApi.
                        get('playlistItems', {
                            params: {
                                part: 'contentDetails',
                                maxResults: 50,
                                playlistId,
                                pageToken,
                            },
                        });
                    return data;
                } catch (err) {
                    const { response } = err;
                    throw new Error(response);
                }
            };


            const loadPlaylistContent = async (pageToken?: string) => {
                const data = await getPlaylistContent(playlistId, pageToken);
                if (data.items.length > 0) {
                    playlistVideos = [
                        ...playlistVideos,
                        ...data.items.map((video: any) => video.contentDetails.videoId),
                    ];

                    if (data.nextPageToken) {
                        await loadPlaylistContent(data.nextPageToken);
                    }
                }
            };

            await loadPlaylistContent();

            const downloadVideos = (videosIds: string[], index: number = 0, cbk?: any) => {
                const videoUrl = `https://www.youtube.com/watch?v=${videosIds[index]}`;
                let cb = downloadVideos;
                if (!videosIds[index + 1]) cb = cbk;
                youtubeUtil.downloadVideo(
                    videoUrl,
                    cb,
                    type,
                    [
                        playlistName
                    ],
                    index + 1,
                    [
                        videosIds,
                        index + 1,
                        cbk,
                    ]
                )
            };

            downloadVideos(playlistVideos, 0, cb);

        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    },
    downloadVideo: async (videoUrl: string, cb: any, type: string = 'mp3', videoStoragePath: string[] = [], index?: number, cbParams: any = []) => {
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
                .addListener('finish', () => {
                    cb(...cbParams)
                });
        } catch (err) {
            if (videoFilePath) fs.unlinkSync(videoFilePath);
            console.log(err);
            throw new Error(err);
        }
    },
};