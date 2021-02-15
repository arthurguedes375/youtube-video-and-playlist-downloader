import { Request, Response, NextFunction } from 'express';

// Utils
import { urlUtil } from '@src/utils/url';
import { downloadUtil } from '@src/utils/download';

// Interfaces
interface IFileController {
    // compressed: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
};

const fileController: IFileController = {
    // compressed: async (req, res, next) => {
    //     try {
    //         const { url } = req;

    //         const filename = urlUtil.getFileName(url);



    //         return next();

    //     } catch (err) {
    //         return res.status(500).json(err);
    //     }
    // },

};

export default fileController;