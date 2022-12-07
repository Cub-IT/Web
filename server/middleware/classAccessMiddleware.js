const ParticipantDAO = require('../dao/PatricipantDAO')

module.exports = function() {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }

        try {
            const user = req.user

            const class_id = req.params.class_id;
            console.log(class_id)

            ParticipantDAO.getClassesIds(user.id, class_id).then((result) => {
                if(result.length == 0)
                    return res.status(400).json({ message: 'User has not access'});
                next()
            })
        } catch (error) {
            return res.status(400).json({ message: 'User has not access'});
        }
    }
}