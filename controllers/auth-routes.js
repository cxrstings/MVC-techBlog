const router = require('express').Router();
const User = require('../models/user');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });
  
    if (!user) {
      return res.render('login', { error: 'No user found with that username!' });
    }
  
    const validPassword = user.checkPassword(req.body.password);
  
    if (!validPassword) {
      return res.render('login', { error: 'Incorrect password!' });
    }
  
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
  
      res.redirect('/');
    });
  });

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/');
    });
  });
  
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.get('/signup', (req, res) => {
    res.render('signup');
  });

  router.post('/signup', async (req, res) => {
    try {
      const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
      });
  
      req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.logged_in = true;
  
        res.redirect('/');
      });
    } catch (err) {
      res.render('signup', { error: 'Error during sign up' });
    }
  });
  
  // Define a route for GET requests to /api/users
router.get('/api/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    // Send the users as a JSON response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  module.exports = router;  