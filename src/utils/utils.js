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

export function buildQuery(params = {}) {
    const qp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === 'object') qp.set(k, JSON.stringify(v));
        else qp.set(k, String(v));
    });
    const qs = qp.toString();
    return qs ? `?${qs}` : '';
}
