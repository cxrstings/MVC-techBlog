const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const moment = require('moment');
const session = require('express-session');
const homeRoutes = require('./controllers/home-routes');
const authRoutes = require('./controllers/auth-routes');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {
    // session expires in two hours
    expires: 7200000
    // // test session expires in 30 seconds
    // expires: 30000
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Set up express-handlebars with a custom helper function
const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    formatDate: function(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    },
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(homeRoutes);
app.use(authRoutes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
