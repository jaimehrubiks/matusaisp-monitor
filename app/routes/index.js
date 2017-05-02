var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    getdata = require('../db/getdata');

/* Logic
router.get('/', function (req, res) {
  res.write('Hello World!');
  if(req.user)
    res.write('User authenticated: ' + req.user)
  else
    res.write('user not authenticated yet, go \<a href=\'/login\'\>here\<\/a\>')
  res.end();
});
 */

router.use(function(req, res, then){
  if(!req.user) req.user = {connected: false};
  then();
})

router.use('/data', require('./data'));

// router.get('/', (req, res) => {
//     res.render('home', { user: req.user, page: '../views/slides' })
// });

router.get('/extranet', (req, res) => {

  if (!req.user.connected){
    var page = '../views/login'
    res.render('home', { user: req.user, page: page, error: req.flash('error') })
  }
  else{
    if (req.user.admin)
      adminLoad(req,res);
    else{
      userLoad(req, res, req.user.name);
    }
  }

})

function adminLoad(req,res){
    var page = '../views/admin';
    getdata.getAdminData()
    .then(_data=>{
        res.render('home', { data: _data, user: req.user, page: page, error: req.flash('error') });   
    })
    .catch(e=>{
        console.log(e);
        res.status(500).end();
    })
}
function userLoad(req,res,username){
    var page = '../views/user';
    getdata.getUserData(username)
    .then(_data=>{
        res.render('home', { data: _data, user: req.user, page: page, error: req.flash('error') });   
    })
    .catch(e=>{
        console.log(e);
        res.status(500).end();
    })
}

router.post('/login',
  passport.authenticate('local', { successRedirect: '/extranet',
                                   failureRedirect: '/extranet',
                                   failureFlash: true })
);
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/extranet');
});

/* Module settings */
module.exports = router;