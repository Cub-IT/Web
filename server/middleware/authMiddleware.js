const jwt = require('jsonwebtoken');

module.exports = function() {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(400).json({ message: 'Token is empty'});
            }
            const decodeData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodeData;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token expired'});
        }
    }
}