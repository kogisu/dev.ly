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
    queryDB: async function(queryStr, vals) {
        try {
            const res = await client.query(queryStr, vals);
            return res.rows;
        } catch(err) {
            return `error occured in querying db`;
        }
    },
    getAllUsers: async function() {
        try {
            const res = await client.query('SELECT * from users', []);
            return res.rows;
        } catch(err) {
            return `error occured in getting users from db: ${err}`;
        }
    },
    createUser: async function(userData) {
        const {name, email, password, avatar} = userData;
        const queryStr = `INSERT into users(name, email, password, avatar, date) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
        try {
            const res = await client.query(queryStr, [name, email, password, avatar, 'NOW()']);
            return res.rows[0];
        } catch(err) {
            return `error occured in posting user to db: ${err}`;
        }
    },
    findUser: async function(userData) {
        const queryStr = `SELECT * from users where email='${userData.email}'`;
        try {
            const res = await client.query(queryStr, []);
            return res.rows;
        } catch(err) {
            return `error occured in finding user: ${err}`;
        }
    }
}

