export const downloadUtil = {
    getBaseUrl: (prefix: string, filename: string) =>
        `http://${process.env.DOMAIN}:${process.env.HTTP_PORT}/downloads/${prefix}/${filename}`,

    generatePlaylistDownloadUrl: (filename: string) =>
        downloadUtil.getBaseUrl('playlists', filename),

    generateVideoDownloadUrl: (filename: string) =>
        downloadUtil.getBaseUrl('videos', filename),

    getDownloadHeaders: (filename: string) => ({
        'Content-Disposition': `attachment; filename="${filename}"`,
    })
};