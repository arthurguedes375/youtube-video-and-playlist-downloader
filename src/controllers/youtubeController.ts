import { Request, Response } from 'express';

// Utils
import { youtubeUtil } from '@src/utils/youtube';

// Interfaces
interface IYoutubeController {
    video: (req: Request, res: Response) => Promise<Response | void>;
};

const youtubeController: IYoutubeController = {
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