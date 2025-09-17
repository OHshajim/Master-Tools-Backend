const setRefreshCookie = (res, token) => {
    res.cookie("refresh_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        domain: process.env.COOKIE_DOMAIN || undefined,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};

const clearRefreshCookie = (res) => {
    res.clearCookie("refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth/refresh",
        domain: process.env.COOKIE_DOMAIN || undefined,
    });
};

module.exports = { setRefreshCookie, clearRefreshCookie };
