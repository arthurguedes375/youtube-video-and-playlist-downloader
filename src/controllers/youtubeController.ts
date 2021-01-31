import { Request, Response } from 'express';

// Utils
import { youtubeUtil } from '@src/utils/youtube';

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
            } = req.body;

            if (!playlist_url) return res.status(400).json({ message: 'It is missing playlist_url on body' })
            if (!playlist_name) return res.status(400).json({ message: 'It is missing playlist_name on body' })


            youtubeUtil.downloadPlaylist(
                playlist_url,
                () => { },
                playlist_name,
                convert_to,
            )
            res.status(200).json({ message: 'Your playlist is gonna be downloaded in few minutes, go get some coffee :)' })

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
                () => {
                    res.status(200).json({ message: 'Video Downloaded' })
                },
                convert_to,
            )
        } catch (err) {
            return res.status(500).json(err);
        }
    },
};

export default youtubeController;