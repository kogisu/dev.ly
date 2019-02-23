const app = require('./bin/www');

const users = require('../routes/api/users');
const profile = require('../routes/api/profile');
const posts = require('../routes/api/posts');

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

app.get('/', (req, res) => {
  res.send('hello');
});


// Use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

