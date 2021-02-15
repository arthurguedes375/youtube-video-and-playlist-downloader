import { Request, Response } from 'express';

// Utils
import { youtubeUtil } from '@src/utils/youtube';
import { parseBool } from '@src/utils/parser';

// Interfaces
interface IYoutubeController {
    video: (req: Request, res: Response) => Promise<Response | void>;
    playlist: (req: Request, res: Response) => Promise<Response | void>;
};

const youtubeController: IYoutubeController = {
    playlist: async (req, res) => {
        try {
            const {
                playlist_url,
                playlist_name,
                convert_to,
                deleted_videos,
            } = req.body;

            let {
                compress,
            } = req.body;

            if (!playlist_url) return res.status(400).json({ message: 'It is missing playlist_url on body' })
            if (!playlist_name) return res.status(400).json({ message: 'It is missing playlist_name on body' })

            const areDeletedVideosRight = (deleted_videos: number[]) => {
                let areDeletedVideosRightReturn = true;

                if (!deleted_videos) return true;
                if (!Array.isArray(deleted_videos)) return false;

                deleted_videos.forEach((value: number) => {
                    if (!Number.isInteger(value)) areDeletedVideosRightReturn = false;
                });

                return areDeletedVideosRightReturn;
            }

            if (!areDeletedVideosRight(deleted_videos)) return res.status(400).json({ message: `The field "deleted_videos" should be an array of numbers` })

            if (parseBool(process.env.FORCE_COMPRESSING)) compress = true;
            if (typeof compress !== 'boolean' && !!compress && !parseBool(process.env.FORCE_COMPRESSING)) return res.status(400).json({ message: `The field "compress" should be a boolean` })


            const downloadCallback = (filedata?: object) => {
                if (parseBool(process.env.LOGS)) {
                    console.log("PLAYLIST DOWNLOAD IS DONE !")
                    console.log(filedata)
                }
                const responseBody = {
                    ...filedata,
                    filepath: undefined,
                    message: 'Your playlist processing is done! You just need to download it clicking on the button below!'
                };
                res.status(200).json(responseBody);
            };

            youtubeUtil.downloadPlaylist(
                playlist_url,
                downloadCallback,
                playlist_name,
                convert_to,
                deleted_videos,
                compress,
            );


        } catch (err) {
            return res.status(500).json(err);
        }
    },
    video: async (req, res) => {
        try {
            const {
                video_url,
                convert_to,
            } = req.body;

            if (!video_url) return res.status(400).json({ message: 'It is missing video_url on body' })

            youtubeUtil.downloadVideo(
                video_url,
                (filedata: any) => {
                    const response = {
                        download: filedata.download,
                        size: filedata.size,
                        message: 'Your video processing is done! You just need to download it clicking on the button below!',
                    };

                    res.status(200).json(response);
                },
                convert_to,
            )
        } catch (err) {
            return res.status(500).json(err);
        }
    },
};

export default youtubeController;