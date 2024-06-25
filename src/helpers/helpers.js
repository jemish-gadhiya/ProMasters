const requestIp = require('request-ip');

async function timestamp(days = 0) {
    let currentTime = Date.now();
    let addTime = (days) ? (days * 24 * 60 * 60 * 1000) : 0;
    return Math.round(((currentTime + addTime) + 10000) / 1000)
}

async function remoteIP(req) {
    return requestIp.getClientIp(req)
}
module.exports = {timestamp ,remoteIP }