export function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    if(d!=0) {
        if(h >= 12) {
            d++
        }
        return d == 1 ? `YESTERDAY` : `${d} DAYS`
    }
    if(h!=0) {
        return h == 1 ? `${h} HOUR` : `${h} HOURS`
    }
    if(m!=0) {
        return m == 1 ? `${m} MINUTE ` : `${m} MINUTES `
    }
    if(s!=0) {
        return s == 1 ? `${s} SECOND` : `${s} SECONDS`
    }
}

export function convertSec(sec) {
    var d, h, m, s;
    m = Math.floor(sec / 60);
    s = sec % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return  (d == 0 ? '' : `${d} days `) +
            (h == 0 ? '' : `${h} hrs `) +
            (m == 0 ? '' : `${m} min `) +
            (s == 0 ? '' : `${s} sec `)
}