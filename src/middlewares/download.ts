import { Request, Response, NextFunction } from 'express';

// Utils
import { urlUtil } from '@src/utils/url';
import { downloadUtil } from '@src/utils/download';

export const downloadMiddleware = {
    headers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { url } = req;

            const filename = urlUtil.getFileName(url);

            res.set(downloadUtil.getDownloadHeaders(filename))

            return next();
        } catch (err) {
            return res.status(500).json(err);
        }
    },
}