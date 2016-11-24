// requireの設定
var mysql = require('mysql');

// MySQLとのコネクションの作成
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '1qaz!QAZ',
  database: 'kyudo'
});

// 接続
connection.connect();

// userdataの取得
connection.query('SELECT * from dan_t;', function (err, rows, fields) {
  if (err) { console.log('err: ' + err); }
  for( i=0 ; i<rows.length; i++){
    console.log('dan_id: ' + rows[i].dan_id);
    console.log('dan_desc: ' + rows[i].dan_desc);
  }
});

// userdataのカラムを取得
// connection.query('SHOW COLUMNS FROM userdata;', function (err, rows, fields) {
//   if (err) { console.log('err: ' + err); }
//
//   console.log(rows[0].Field);
//   console.log(rows[1].Field);
// });

// 接続終了
connection.end();
