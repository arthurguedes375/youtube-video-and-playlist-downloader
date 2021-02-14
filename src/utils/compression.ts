// Node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Utils
import { parseBool } from './parser';

// Archiver
import archiver from 'archiver';



export const compressionUtil = {
    compress: (pathin: string, cb: (filedata?: object) => any) => {
        const dirs = pathin.split('/');

        const outFileName = crypto.randomBytes(16).toString('hex') + '___' + dirs[dirs.length - 1] + '.zip';

        const outPath = path.resolve('saves', 'compressed', outFileName)

        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', {
            zlib: { level: Number.parseInt(<any>process.env.COMPRESS_LEVEL) },
        });

        const downloadLink = `http://${process.env.DOMAIN}:${process.env.HTTP_PORT}/downloads/playlist/${outFileName}`;


        output.on('close', function () {
            const bytes = archive.pointer();
            if (parseBool(process.env.LOGS)) {
                console.log((bytes / 1024 / 1024) + ' mb');
                console.log('Compression has been finalized and the output file is ready.');
            }
            cb({
                filepath: outPath,
                filename: outFileName,
                download: downloadLink,
                size: bytes,
            });
        });

        archive.on('error', function (err) {
            console.error(err)
        });

        archive.pipe(output);


        archive.directory(pathin, dirs[dirs.length - 1]);

        archive.finalize();
    },
};