export function deepGet(obj, path, defaultValue = undefined) {
    if (!path) return defaultValue;
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
        if (cur == null) return defaultValue;
        cur = cur[p];
    }
    return cur === undefined ? defaultValue : cur;
}

export function buildQuery(params) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') return;

        if (Array.isArray(value)) {
            value.forEach(item => searchParams.append(key, item));
        } else if (typeof value === 'object') {
            searchParams.append(key, JSON.stringify(value));
        } else {
            searchParams.append(key, value.toString());
        }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
}
