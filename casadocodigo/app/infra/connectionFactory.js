var mysql = require('mysql');

var createDBConnection = function () {

  if(!process.env.NODE_ENV){
    return mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "9330923a",
      database: "casadocodigo"
    });
  }

  if(process.env.NODE_ENV == "test"){
    return mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "9330923a",
      database: "casadocodigo_test"
    });
  }


}


module.exports = function () {
  return createDBConnection;
}
