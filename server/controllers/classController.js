const tm = require('../tokenManager');

const Class = require('../models/ClassModel');

class classController {
    async getClasses(req, res) {
        try {
            const user = tm.getUserData(req);

            Class.getClasses(user.id).then( (classes) => {
                return res.status(200).json(classes);
            }).catch((error) => {
                return res.status(400).json(error.message);
            });
            
        } 
        catch (error) {
            res.status(401).json({message: 'User is not Authorized'});
        }
    }

    async getClass(req, res) {
        try {
            const user = tm.getUserData(req);

            const class_id = req.params.class_id;

            Class.getClass(user.id, class_id).then( (group) => {
                return res.status(200).json(group);
            }).catch((error) => {
                return res.status(400).json(error.message);
            });   
        } 
        catch (error) {
            res.status(401).json({message: 'User is not Authorized'});
        }
    }

    async createClass(req, res) {
        try {
            const user = tm.getUserData(req);

            const { title, description } = req.body

            Class.createClass(title, description, user.id).then((result) => {
                return res.status(200).json(result);
            }).catch((error) => {
                return res.status(400).json({ message: "Insert Error" });
            })
        } catch (error) {
            return res.status(400).json({ message: "Insert Error" });
        }
    }

    async addUser(req, res) {
        try {
            const user = tm.getUserData(req)

            const { code } = req.body
            
            Class.addUser(user.id, code).then((group) => {
                return res.status(200).json({ group })
            })
        } catch (error) {
            return res.status(400).json({ message: "Join Error" })
        }
    }

    // async getPeople(req, res) {
    //     try {
    //         const token = req.headers.authorization.split(' ')[1];

    //         const user = tm.getUserData(token);

    //         const class_id = req.params.id;

    //         const sql = 
    //         `SELECT first_name, last_name, email, color, par.label FROM user
    //         INNER JOIN 
    //         (SELECT user_id, label FROM participant par1
    //         INNER JOIN  (SELECT class_id FROM participant WHERE user_id = ${user.id} AND class_id = ${class_id}) par2
    //         ON par1.class_id = par2.class_id) par
    //         ON par.user_id = user.id`;

    //         db.query(sql, (err, result) => {
    //             if (err)
    //                 return res.status(400).json({ "status" : "Error" });


    //             result = result.reduce((obj,user) => {
    //                 obj[user.label].push(user);
    //                 return obj;
    //             }, { 'admin' : [], 'user' : [] });

    //             return res.status(200).json({ "people" : (req.params.role ? result[req.params.role] : result) });
    //         });     
    //     } 
    //     catch (error) {
    //         res.status(401).json({message: 'User is not Authorized'});
    //     }
    // }
}

module.exports = new classController();