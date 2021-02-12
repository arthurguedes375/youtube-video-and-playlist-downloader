import fs from 'fs';
import path from 'path';

export const dirUtil = {
    setUpDirs: () => {
        try {
            const dirs: any = {
                saves: {
                    compressed: null,
                    playlists: null,
                    videos: null,
                }
            };

            const verifyDirs = (dirs: any, prefix: any = []) => {
                Object.keys(dirs).forEach((dirObj: string) => {
                    const dir = path.resolve(...prefix, dirObj);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

                    if (dirs[dirObj]) {
                        verifyDirs(dirs[dirObj], [...prefix, dirObj]);
                    }

                })
            }

            verifyDirs(dirs);
        } catch (err) {
            throw new Error(err);
        }
    },
};