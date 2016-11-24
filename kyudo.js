var kyudo = (function() {

  var
    list, mysql, connection;

  mysql = require('mysql');
  connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1qaz!QAZ',
    database : 'kyudo'
  });

  list = function() {
    connection.connect();
    connection.query('SELECT * from dan_t;', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); }
      for( i=0 ; i<rows.length; i++){
        console.log('dan_id: ' + rows[i].dan_id);
        console.log('dan_desc: ' + rows[i].dan_desc);
      }
    });

    connection.end();
  };

  return {
    list : list
  };

}());


var
  a_button, b_button, search;

l_button = document.getElementById('list');
go_button = document.getElementById('godan');

l_button.addEventListener('click', function() {
  kyudo.list();
});
