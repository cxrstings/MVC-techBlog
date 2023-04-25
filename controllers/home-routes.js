const router = require('express').Router();
const { Sequelize } = require('../config/connection');
const { Post } = require('../models/post');

router.get('/', async (req, res) => {
    res.redirect('/home');
});

router.get('/home', async (req, res) => {
    const userPosts = await Post.findAll({});
    const posts = userPosts.map((post) => post.get({ plain: true }));
    res.render('home', { posts, logged_in: req.session.logged_in })
});

module.exports = router;