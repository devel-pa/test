'use strict'

const { Strategy } = require('passport-local');
const uuidv1 = require('uuid/v1');
const sendmail = require('sendmail')();

const getUserByEmail = async (conn, email) => {
    const [rows, fields] = await conn.execute(`select * from users where email = "${email}"`);
    return rows;
};
const insertNewUser  = async (conn, email, pass) => {
    const uuid = uuidv1();
    await conn.execute(`insert into users (email, password, code) values ("${email}", "${pass}", "${uuid}")`);
    return uuid;
};

const getLocalSignup = (conn) => new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    // passReqToCallback: true
}, (email, password, done) => {
    getUserByEmail(conn, email)
        .then((rows) => {
            console.log(rows.length);
            if(rows.length > 0 ) {
                throw new Error('User already exists!')
            }
            insertNewUser(conn, email, password)
                .then((uuid) => {
                    sendmail({
                        from: 'no-reply@yourdomain.com',
                        to: email,
                        subject: 'verification code',
                        html: `Check you code to enable account : <a href="http://localhost:8080/verify/${uuid}"`,
                      }, function(err, reply) {
                        console.log(err && err.stack);
                        console.dir(reply);
                    });
                    return done(null, rows[0]);
                })
                .catch((error) => done(error));
        })
        .catch(error => done(error));
});

const getLocalLogin = (conn) => new Strategy({
    usernameField: 'email',
    passwordField: 'password',
    // passReqToCallback: true
}, (email, password, done) => {
    getUserByEmail(conn, email)
        .then(rows => {
            if(rows.length !== 1) {
                return done(new Error('Issue with required user'));
            }
            if(1 !== rows['verified']) {
                return done(new Error('Email not verified'));
            }
            if(password !== rows['password']) {
                return done(new Error('Password does not match!'));
            }
            done(null, rows[0]);
        }) 
        .catch(error => done(error));
});

module.exports = { getLocalSignup, getLocalLogin };
