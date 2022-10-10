const jwt = require('jsonwebtoken');
const db = require('./../db');
const tm = require('./../tokenManager');

class classController {
    async getClasses(req, res) {
        try {
            const user_id = req.user.id;

            const sql = 
            `SELECT * FROM class
            WHERE id in (SELECT class_id FROM participant WHERE user_id = ${user_id})`;

            db.query(sql, (err, result) => {
                if (err)
                    return res.status(400).json({ "status" : "Error" });
                return res.status(200).json({ "classes" : result });
            });
        } 
        catch (error) {
            res.status(400).json({message: 'User is not Authorized'});
        }
    }

    async getClass(req, res) {
        try {
            const user_id = req.user.id;

            const class_id = req.params.id;

            const sql = 
            `SELECT * FROM class
            WHERE id in (SELECT class_id FROM participant WHERE user_id = ${user_id} AND class_id = ${class_id})`;

            db.query(sql, (err, result) => {
                if (err)
                    return res.status(400).json({ "status" : "Error" });
                return res.status(200).json({ "class" : result });
            });     
        } 
        catch (error) {
            res.status(400).json({message: 'User is not Authorized'});
        }
    }

    async getPeople(req, res) {
        try {
            const user_id = req.user.id;

            const class_id = req.params.id;

            const sql = 
            `SELECT first_name, last_name, email, color, par.label FROM user
            INNER JOIN 
            (SELECT user_id, label FROM participant par1
            INNER JOIN  (SELECT class_id FROM participant WHERE user_id = ${user_id} AND class_id = ${class_id}) par2
            ON par1.class_id = par2.class_id) par
            ON par.user_id = user.id`;

            db.query(sql, (err, result) => {
                if (err)
                    return res.status(400).json({ "status" : "Error" });


                result = result.reduce((obj,user) => {
                    obj[user.label].push(user);
                    return obj;
                }, { 'admin' : [], 'user' : [] });

                return res.status(200).json({ "people" : (req.params.role ? result[req.params.role] : result) });
            });     
        } 
        catch (error) {
            res.status(400).json({message: 'User is not Authorized'});
        }
    }
}

module.exports = new classController();