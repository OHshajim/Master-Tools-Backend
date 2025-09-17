const jwt = require("jsonwebtoken");

const signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn:"7d",
    });
};

const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn:"7d",
    });
};

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
const verifyRefreshToken = (token) =>
    jwt.verify(token, process.env.REFRESH_SECRET);

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
