export const videoUtil = {
    transformVideoTitle: (oldTitle: string) => oldTitle.toLowerCase()
        .replace(/\s/g, '_')
        .replace(/\//g, '')
        .replace(/\\/g, '')
        .replace(/'/g, '')
        .replace(/['"]+/g, ''),
};