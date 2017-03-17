var express       = require('express'),
    cookieParser  = require('cookie-parser'),
    //cookieSession = require('cookie-session'),
    bodyParser    = require('body-parser'),
    //bodyParser    = require('body-parser'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
//const MongoStore = require('connect-mongo')(session);
//var MongoClient = require('mongodb').MongoClient
const MongoStore = require('connect-mongo')(session);

var database = require('./database')
database.connect();

var app = express();
var cookieKey = 'secret'

passport.use(new LocalStrategy(
  function(username, password, done) {
    user = { username: username, password: password};
    console.log(user.username)
    if(user.username==='admin') return done(null, user);
    else return done(null, false, { message: 'Incorrect password.' })
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
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  done(null, id)
  /*
  User.findById(id, function(err, user) {
    done(err, user);
  });
  */
});

app.use(cookieParser());
//app.use(bodyParser());
// app.use(cookieSession({
//   name:   'session_id',
//   keys:   [cookieKey],
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours 
// }))

// app.use(session({
//     secret: cookieKey,
//     store: new MongoStore({
//       url: 'mongodb://localhost:27017/matusaisp',
//       ttl: 14 * 24 * 60 * 60 // = 14 days. Default
//     })
// }));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));
         
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.write('Hello World!');
  if(req.user)
    res.write('User authenticated: ' + req.user)
  else
    res.write('user not authenticated yet, go \<a href=\'/login\'\>here\<\/a\>')
  res.end();
});




app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/fail.html',
                                   failureFlash: false })
);
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
