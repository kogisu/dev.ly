const config = require('../server/config');
const { Client } = require('pg');

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const client = new Client({
    host: config.HOST,
    port: config.POSTGRES_PORT,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD
});

client.connect(err => {
    if (err) {
        console.error('connection error', err.stack);
    } else {
        console.log('connected to db!!');
    }
});

module.exports = {
    getAllUsers: async function() {
        try {
            const res = await client.query('SELECT * from users', []);
            return res;
        } catch(err) {
            return `error occured in getting users from db: ${err}`;
        }
    },
    createUser: async function(userData) {
        const {name, email, password, avatar} = userData;
        const queryStr = `INSERT into users(name, email, password, avatar, date) VALUES ($1,$2,$3,$4,$5);`;
        try {
            const res = await client.query(queryStr, [name, email, password, avatar, 'NOW()']);
            return res;
        } catch(err) {
            return `error occured in posting user to db: ${err}`;
        }
    }
}

