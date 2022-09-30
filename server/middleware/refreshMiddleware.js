const jwt = require('jsonwebtoken');

const { logins } = require('./../tokenManager')

module.exports = function() { 
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const refreshToken = req.headers.refresh.split(' ')[1];
            if (!refreshToken || !logins.get(refreshToken) ) {
                return res.status(401).json({ message: 'Refresh Token is expired'});
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: 'Refresh Token is expired'});
        }
    }
}