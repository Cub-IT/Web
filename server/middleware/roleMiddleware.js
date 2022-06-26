const jwt = require('jsonwebtoken');
const { secret } = require('./../config');

module.exports = function(roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }
    
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: 'User is not authorized'});
            }
            const { role: userRole } = jwt.verify(token, secret);

            const hasRole = roles.includes(userRole);
            console.log('has role'+ userRole + hasRole);

            if(!hasRole) {
                return res.status(403).json({ message: 'You do not have access'});
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ message: 'User is not authorized'});
        }
    }
}