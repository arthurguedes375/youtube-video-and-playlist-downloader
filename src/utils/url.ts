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
}