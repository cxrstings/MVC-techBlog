const router = require('express').Router();
const { Post, User } = require('../models'); // Import both Post and User models

router.get('/', async (req, res) => {
    res.redirect('/home');
});

router.get('/home', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('home', { posts, logged_in: req.session.logged_in });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;