const router = require('express').Router();
const { Post, User, Comment } = require('../models');
// render dashboard
router.get('/', async (req, res) => {
    try {
        // Verify if the user is logged in
        if (!req.session.logged_in) {
            res.redirect('/login');
            return;
        }

        // Check if the req.session.user object is set
        if (!req.session.user || !req.session.user.id) {
            console.error('User object not found in session');
            res.status(403).json({ message: 'Unauthorized access' });
            return;
        }

        const userData = await User.findOne({
            where: { id: req.session.user.id },
            include: [{ model: Post, include: [Comment] }],
        });

        if (!userData) {
            console.error('User not found');
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const posts = userData.Posts.map(post => post.get({ plain: true }));

        res.render('dashboard', { posts, logged_in: req.session.logged_in });
    } catch (err) {
        console.error('Error in dashboard route:', err);
        res.status(500).json(err);
    }
});
// add a new post
router.post('/api/posts', async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user.id,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(500).json(err);
    }
});
// update existing post
router.put('/api/posts/:id', async (req, res) => {
    try {
        const updatedPost = await Post.update(req.body, {
            where: {
                id: req.params.id,
            },
        });

        if (!updatedPost) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});
// delete a specific post
router.delete('/api/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.destroy({
            where: {
                id: req.params.id,
            },
        });

        if (!deletedPost) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;