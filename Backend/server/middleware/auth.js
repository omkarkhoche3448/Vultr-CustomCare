const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret-change-in-production';

const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({
                    status: 'error',
                    code: 'TOKEN_EXPIRED',
                    message: 'Token has expired'
                });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({
            status: 'error',
            code: 'NO_TOKEN',
            message: 'No authorization token provided'
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({
            status: 'error',
            code: 'UNAUTHORIZED',
            message: 'Admin access required'
        });
    }
};

const isSalesRep = (req, res, next) => {
    if (req.user && req.user.role === 'SALES_REP') {
        next();
    } else {
        res.status(403).json({
            status: 'error',
            code: 'UNAUTHORIZED',
            message: 'Sales representative access required'
        });
    }
};

const publicLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: {
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later'
    }
});

const protectedLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    message: {
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later'
    }
});

module.exports = {
    authenticateJwt,
    isAdmin,
    isSalesRep,
    publicLimiter,
    protectedLimiter,
    JWT_SECRET,
    REFRESH_TOKEN_SECRET
};
