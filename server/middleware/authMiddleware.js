const tm = require('../tokenManager');

module.exports = function() {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const user = tm.getUserData(req);
            
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token expired'});
        }
    }
}