const jwt = require('jsonwebtoken');

const isloggedin = (req, res, next) => {
    const token = req.cookies.usertoken;
    if (!token) {
        req.user = null;
        return next();
    }
    try {
        const decoded = jwt.verify(token, "secretkey");
        req.user = decoded.user;
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

const requireAuth = (req, res, next) => {
    const token = req.cookies.usertoken;
    if (!token) return res.status(401).json({ success: false, error: "Not authenticated" });
    try {
        const decoded = jwt.verify(token, "secretkey");
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: "Not authenticated" });
    }
};

const issignuploginenabled = (req, res, next) => {
    if (req.cookies.usertoken) {
        return res.status(400).json({ success: false, error: "Already logged in" });
    } else next();
};

module.exports = { isloggedin, requireAuth, issignuploginenabled };