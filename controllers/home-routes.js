const router = require('express').Router();
const { Post, User, Comment } = require('../models'); // Import both Post and User models

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
                {
                    model: Comment,
                    attributes: ['id', 'text', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },
                },
            ],
            order: [['created_at', 'DESC']],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('home', { posts, logged_in: req.session.logged_in, user_id: req.session.user_id });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.post('/home', async (req, res) => {
    console.log(req.body);
    try {
      const newComment = await Comment.create({
        text: req.body.text,
        post_id: req.body.post_id,
        user_id: req.session.user.id,
      });
  
      res.status(200).json(newComment);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

module.exports = router;