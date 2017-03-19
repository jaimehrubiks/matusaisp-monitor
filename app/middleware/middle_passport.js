var express       = require('express'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    dbop          = require('../db/operations')

module.exports = function(passport){

    passport.use(new LocalStrategy(
        function(username, password, done) {

            dbop.findUserByName(username)
            .then(user=>{
                if (user.pwd === password){
                    user.connected = true;
                    done(null, user)
                }
                else
                    done(null, false, { message: 'Incorrect password.' })
            })
            .catch(e=>{
                done(null, false, { message: 'No such user.' })
            })

            // console.log(username)
            // user = { username: username, password: password};
            // if(user.username==='admin') return done(null, user);
            // else return done(null, false, { message: 'Incorrect password.' })
            /*
            User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
            });
            */
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        done(null, id)
        /*
        User.findById(id, function(err, user) {
            done(err, user);
        });
        */
    });


}