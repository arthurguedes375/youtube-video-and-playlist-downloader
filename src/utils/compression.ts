import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

export const compressionUtil = {
    compress: (pathin: string, cb: () => any) => {
        const dirs = pathin.split('/');

        const outPath = path.resolve('saves', 'compressed', dirs[dirs.length - 1] + '.zip')

        const output = fs.createWriteStream(outPath);
        const archive = archiver('zip', {
            zlib: { level: Number.parseInt(<any>process.env.COMPRESS_LEVEL) },
        });


        output.on('close', function () {
            if (process.env.LOGS) {
                console.log((archive.pointer() / 1024 / 1024) + ' mb');
                console.log('Compression has been finalized and the output file is ready.');
            }
            cb();
        });

        archive.on('error', function (err) {
            console.error(err)
        });

        archive.pipe(output);


        archive.directory(pathin, dirs[dirs.length - 1]);

        archive.finalize();
    },
};