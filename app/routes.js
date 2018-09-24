'use strict'

module.exports = (app, passport, conn) => {
    app.get('/', (req, res) => res.render(''));

    app.get('/login', (req, res) => res.render('login.ejs'));
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login'
    })); // TODO
    app.get('/logout', (req, res) => res.render(''));

    app.get('/register', (req, res) => res.render('register.ejs'));
    app.post('/register', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/register'
    }));

    app.get('/verify/:code', (req, res) => {
        conn.execute(`select * from users where code = "${req.params.code}"`)
            .then(([rows, fields]) => {
                if(rows.length === 1 && rows[0]['verified'] === 0) {
                    const uid = rows[0]['id'];
                    conn.execute(`update users set verified = 1 where id = ${uid}`);
                    return res.redirect('/login');
                }
            });
    });
};
