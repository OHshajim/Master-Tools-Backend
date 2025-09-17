const crypto = require("crypto");

const randomId = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

module.exports = { randomId, hashToken };
