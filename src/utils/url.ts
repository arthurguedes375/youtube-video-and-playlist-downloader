export const urlUtil = {
    parseQueryParams: (url: string): any => {
        const { search: queryString } = new URL(url);
        let queryArr = queryString
            .replace('?', '')
            .split('&');

        let query = {};

        queryArr.map((param: string) => {
            const [key, value] = param.split('=');
            query = {
                ...query,
                [key]: value
            }
        });
        return query;
    },
    getFileName: (url: string): any => {
        const urlSplitted = url.split('/');
        const filename = urlSplitted[urlSplitted.length - 1];
        return filename;
    },
}