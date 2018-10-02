'use strict'

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mysql = require('mysql2/promise');
const { getLocalSignup, getLocalLogin } = require('./app/strategy');

const getConnection = async () => await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const connection = getConnection()
.then(conn => {
    const app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        conn.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    passport.use('local-signup', getLocalSignup(conn));
    passport.use('local-login', getLocalLogin(conn));

    app.set('view engine', 'ejs');

    require('./app/routes')(app, passport, conn);

    app.listen(8080, () => console.log('server started'));
});
