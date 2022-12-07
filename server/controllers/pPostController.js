const tm = require('../tokenManager');

const Post = require('../models/pPostModel');

class classController {
    async createPost(req, res) {
        try {
            const user = req.user

            const class_id = req.params.class_id

            const { title, description } = req.body;

            Post.createPost(title, description, user.id, class_id).then( (result) => {
                return res.status(200).json(result);
            }).catch((error) => {
                return res.status(400).json(error.message);
            });
            
        } 
        catch (error) {
            res.status(401).json({message: 'User is not Authorized'});
        }
    }

    async getPost(req, res) {
        try {
            const class_id = req.params.class_id
            const post_id = req.params.post_id

            Post.getPost(class_id, post_id).then( (post) => {
                return res.status(200).json(post);
            }).catch((error) => {
                return res.status(400).json(error.message);
            });   
        } 
        catch (error) {
            res.status(401).json({message: 'Get Post Error'});
        }
    }

    async getPosts(req, res) {
        try {
            const class_id = req.params.class_id

            Post.getPosts(class_id).then( (posts) => {
                return res.status(200).json(posts);
            }).catch((error) => {
                return res.status(400).json(error.message);
            });   
        } 
        catch (error) {
            res.status(401).json({message: 'Get Post Error'});
        }
    }
}

module.exports = new classController();