const ParticipantDAO = require('../dao/PatricipantDAO')

module.exports = function() {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const user = req.user

            const class_id = req.params.class_id;

            ParticipantDAO.getClassesIds(user.id, class_id, 'admin').then((result) => {
                if(result.length == 0) {
                    console.log('Not admin')
                    return res.status(400).json({ message: 'User has not access'});
                }
                next()
            })
        } catch (error) {
            console.log('Not admin1')
            return res.status(400).json({ message: 'User has not access'});
        }
    }
}