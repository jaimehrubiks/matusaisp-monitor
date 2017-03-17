var MongoClient = require( 'mongodb' ).MongoClient;

var _db;

module.exports = {

  connect: function( callback ) {
    MongoClient.connect( "mongodb://localhost:27017/matusaisp", function( err, db ) {
      
      if(err) console.log(err)
      else{
          console.log('mongodb connected to matusaisp')
          _db = db;
      }
    } );
  },

  db: _db
};