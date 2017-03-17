var express       = require('express'),
    cookieParser  = require('cookie-parser'),
    bodyParser    = require('body-parser'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    session = require('express-session'),
    morgan = require('morgan');

//const MongoStore = require('connect-mongo')(session);
var database = require('./database')
database.connect();

var sessionPwd = 'secret'
var port = '3000'

var app = express();


passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log(username)
    user = { username: username, password: password};
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

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser());
app.use(session({
  name:   'session_id',
  keys:   [sessionPwd],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours,
  resave: true,
  saveUninitialized: false,
  secret: sessionPwd
}))

app.use(passport.initialize());
app.use(passport.session());
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
