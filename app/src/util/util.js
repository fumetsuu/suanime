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
        return d == 1 ? `Yesterday` : `${d} Days`
    }
    if(h!=0) {
        return h == 1 ? `${h} Hour` : `${h} Hours`
    }
    if(m!=0) {
        return m == 1 ? `${m} Minute ` : `${m} Minutes `
    }
    // return s == 1 ? `${s} Second` : `${s} Seconds`
    return 'Moments Ago'
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

export function fixURL(url) {
    return encodeURIComponent(url.replace('/', ""))
}

export function fixURLMA(url) {
    console.log(url)
    return encodeURIComponent(url.replace(/\//, "").substr(0, 25))

}