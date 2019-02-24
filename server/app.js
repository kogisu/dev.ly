const app = require('./bin/www');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('../routes/api/users');
const profile = require('../routes/api/profile');
const posts = require('../routes/api/posts');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

// Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

