var MongoClient = require( 'mongodb' ).MongoClient;

var url = "mongodb://localhost/matusaisp"
var db;

module.exports = {

  connect: function( callback ) {
    MongoClient.connect(url, function( err, _db ) {
      
      if(err) console.log(err)
      else{
          console.log('mongodb connected to ' + url)
          db = _db;
      }
    } );
  },

  db: function(){return db},
  url: url

};