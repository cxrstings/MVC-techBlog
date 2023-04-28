const router = require('express').Router();
const User = require('../models/user');

// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { username } });
  
    if (!user || !user.checkPassword(password)) {
      res.status(401).render('login', { error: 'Incorrect username or password' });
      return;
    }
  
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;
  
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

// Signup route
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
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;