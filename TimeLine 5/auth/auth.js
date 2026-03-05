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

    if (!token) {
        return res.redirect('/user/signup-login');
    }

    try {
        const decoded = jwt.verify(token, "secretkey");
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.redirect('/user/signup-login');
    }
};

const issignuploginenabled = (req, res, next) => {
    if (req.cookies.usertoken) {
        res.redirect('/timeline');
    } else {
        next();
    }
};

module.exports = {
    isloggedin,
    requireAuth,
    issignuploginenabled
};