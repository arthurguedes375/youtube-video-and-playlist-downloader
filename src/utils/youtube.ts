// Node
import fs from 'fs';
import path from 'path';

// Youtube
import youtube from 'ytdl-core';
import youtubeApi from '@config/youtubeApi';

// Utils
import { videoUtil } from '@utils/video';
import { urlUtil } from '@utils/url';
import { compressionUtil } from './compression';
import { parseBool } from './parser';

export const youtubeUtil = {
    getPlaylistPageContent: async (playlistId: string, pageToken?: string) => {
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
    },

    downloadPlaylist: async (playlistUrl: string, cb: (filedata?: object) => any, playlistName: string, type: string = 'mp3', deletedVideos: number[] = [], compress: boolean = false) => {
        try {

            deletedVideos = deletedVideos.map(index => index - 1)

            const { list: playlistId } = urlUtil.parseQueryParams(playlistUrl);

            let playlistVideos: string[] = [];

            const loadPlaylistContent = async (pageToken?: string) => {
                const data = await youtubeUtil.getPlaylistPageContent(playlistId, pageToken);
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
            playlistVideos = playlistVideos.filter((value, index) => !deletedVideos.includes(index));

            const downloadVideos = (videosIds: string[], index: number = 0, cbk?: any) => {
                const index_steps = Number.parseInt(<any>process.env.WORKERS);

                // LOGS
                if (parseBool(process.env.LOGS)) {
                    const downloadedPercentage = Math.round(((index + 1) / videosIds.length) * 100);
                    let points = '';
                    for (let i = 0; i < downloadedPercentage / 5; i++) {
                        points = points + '.';
                    }
                    console.clear();
                    console.log(`${index + 1}/${videosIds.length} [${points}] ${downloadedPercentage}%`);
                }
                // --------

                const videoUrl = `https://www.youtube.com/watch?v=${videosIds[index]}`;
                let cb = downloadVideos;
                if (!videosIds[index + index_steps]) cb = cbk;
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
                        index + index_steps,
                        cbk
                    ]
                )
            };

            let cont = 0;

            let processWorkers = Number.parseInt(<any>process.env.WORKERS);

            if (playlistVideos.length < processWorkers) processWorkers = playlistVideos.length;


            for (let i = 0; i <= ((processWorkers - 1) || 0); i++) {
                downloadVideos(playlistVideos, 0 + i, () => {
                    cont++;
                    if (cont === processWorkers) {
                        if (compress) {
                            compressionUtil.compress(path.resolve('saves', 'playlists', playlistName), (filedata) => {
                                fs.rmdirSync(path.resolve('saves', 'playlists', playlistName), { recursive: true });
                                cb(filedata);
                            })
                        } else {
                            cb()
                        }
                    }
                });
            }


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