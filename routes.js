'use strict';
var
  configRoutes, i, b, t, send_str, entered_time,
  mysql = require('mysql'),
  connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1qaz!QAZ',
    database : 'kyudo'
  });



configRoutes = function ( app, server ) {
  app.get( '/', function ( req, res ) {
    res.redirect( '/index.html' );
  });

  app.get( '/list/:dan?', function ( req, res ) {
    b = Math.floor(req.params.dan / 10);
    t = req.params.dan % 10;

    connection.query('SELECT * from meibo where dan<=' + t + ' and dan>=' + b + ' order by dan desc, shogo desc, shodan', function (err, rows, fields) {
       if (err) { console.log('err: ' + err); }
       send_str = '<html><head><link rel="stylesheet" href="../kyudo.css" type="text/css"/></head><body>';
       for( i=0 ; i<rows.length; i++){
         send_str += '<a href="/person/' + rows[i].id + '">' + '<div id=' + rows[i].id + ' class="person">' + rows[i].name + '</div></a>';
       }
       send_str += '<br><br><a href="/">ホームへ戻る</a></body></html>';
       res.send(send_str);
    });
  });

  app.get( '/person/:id?', function( req, res) {
    connection.query('SELECT meibo.id, meibo.name, status.meibo_id, status.active, status.enter_time from meibo, status where meibo.id=status.meibo_id and meibo.id=' + req.params.id, function (err, rows, fields) {
      if (err) { console.log('err: ' + err); }
      if (rows.length!=1) {console.log('err: length!=1');}

      send_str = '<html><head><link rel="stylesheet" href="../kyudo.css" type="text/css"/></head><body>';
      send_str += 'あなたは <font size=6>' + rows[0].name + 'さん</font> ですね？<br>';

      if (rows[0].active) {
        send_str += '<p>' + rows[0].name + 'さんは' + rows[0].enter_time + 'に入場済みです</p>';
        send_str += '<p>退場しますか？</p>'
        send_str += '<a href="/leave/' + rows[0].id + '">' + '<div id="leave">退場</div></a>';
        send_str += '<a href="/"><div id="cancel">キャンセル</div></a>';
      } else {
        send_str += '<p>入場しますか？</p>'
        send_str += '<a href="/enter/' + rows[0].id + '">' + '<div id="enter">入場</div></a>';
        send_str += '<a href="/"><div id="cancel">キャンセル</div></a>';
      }
      send_str += '</body></html>';

      res.send(send_str);
    });

  });

  app.get( '/enter/:id?', function ( req, res) {
    connection.query('SELECT * from status where status.meibo_id=' + req.params.id, function (err, rows, fields) {
      if (err) { console.log('err: ' + err); }
      if (rows[0].active) {
        send_str = '<html><body>' + rows[0].enter_time + ' に入場済みです';
        send_str += '<br><br><a href="/">ホームへ戻る</a></body></html>';
        res.send(send_str);
      } else {
        connection.query('INSERT into attendance values ( NOW(), null,'
          + req.params.id + ')', function (err, rows, fields) {
            if (err) { console.log('err: ' + err); }
        });
        connection.query('UPDATE status set active=true, enter_time=NOW() '
          + 'where meibo_id=' + req.params.id, function (err, rows, fields) {
            if (err) { console.log('err: ' + err); }
        });
        send_str = '<html><body>入場を受け付けました';
        send_str += '<br><br><a href="/">ホームへ戻る</a></body></html>';
        res.send(send_str);
      }
    });
  });

  app.get( '/leave/:id?', function ( req, res) {
    connection.query('SELECT * from status where status.meibo_id=' + req.params.id, function (err, rows, fields) {
      if (err) { console.log('err: ' + err); }
      if (!rows[0].active) {
        send_str = '<html><body>入場していません';
        send_str += '<br><br><a href="/">ホームへ戻る</a></body></html>';
        res.send(send_str);
      } else {
        connection.query('UPDATE attendance set leave_time=NOW() '
          + 'where leave_time is null and meibo_id=' + req.params.id , function (err, rows, fields) {
            if (err) { console.log('err: ' + err); }
        });
        connection.query('UPDATE status set active=false, enter_time=null '
          + 'where meibo_id=' + req.params.id, function (err, rows, fields) {
            if (err) { console.log('err: ' + err); }
        });
        send_str = '<html><body>退場を受け付けました';
        send_str += '<br><br><a href="/">ホームへ戻る</a></body></html>';
        res.send(send_str);
      }
    });
  });

  app.get( '/exist', function ( req, res) {
    connection.query('SELECT meibo.id, meibo.name, status.enter_time from meibo, status where status.active=true and meibo.id=status.meibo_id', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); }

      send_str = '<html><head><link rel="stylesheet" href="../kyudo.css" type="text/css"/></head><body>';

      if(rows.length==0) {
        send_str += '誰も入場していません';
      } else {
        for ( i=0 ; i<rows.length ; i++) {
          send_str += '<a href="/person/' + rows[i].id + '">' + '<div id=' + rows[i].id + ' class="person">' + rows[i].name + '</div></a>';
        }
      }
      send_str += '<br><br><a href="/">ホームへ戻る</a></body></html>';
      res.send(send_str);

    });
  });

  app.get( '/today', function ( req, res ) {
    connection.query('SELECT meibo.id, meibo.name, cast(attendance.enter_time as time) as enter_time, cast(attendance.leave_time as time) as leave_time from meibo, attendance where enter_time between CURDATE() and CURDATE()+1 and meibo.id=attendance.meibo_id', function (err, rows, fields) {
      if (err) { console.log('err: ' + err); }

      send_str = '<html lang="ja"><head><link rel="stylesheet" href="../kyudo.css" type="text/css"/></head><body>';

      if(rows.length==0) {
        send_str += '誰も入場していません';
      } else {
        for ( i=0 ; i<rows.length ; i++) {
          send_str += '<a href="/person/' + rows[i].id + '">' + '<div id=' + rows[i].id + ' class="person">' + rows[i].name + '</div></a>';
          send_str += rows[i].enter_time + '    ' + rows[i].leave_time;
        }
      }
      send_str += '<br><br><a href="/">ホームへ戻る</a></body></html>';
      res.send(send_str);

    });
  });

};



module.exports = {
  configRoutes : configRoutes
};

connection.connect( function () {
  console.log( '** Connected to mysql **' );
});
