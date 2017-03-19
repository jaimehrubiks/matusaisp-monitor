var express = require('express'),
    router = express.Router(),
    passport = require('passport');

var dbop = require('../db/operations');


router.get('/allusers', (req, res) => {
    if(!req.user.admin) res.status(403).end();
    dbop.findAllUsers()
    .then(users=>res.send(users))
    .catch(e=>{
        console.log(e)
        res.status(500).end()
    })
})

/* Module settings */
module.exports = router;