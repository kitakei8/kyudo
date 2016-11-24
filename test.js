var
  cancel_b = document.getElementById('cancel'),

cancel_b.addEventListener('click', function(){
  location.href = '/index.html';
});

// enter_b.addEventListener('click', function(){
//   connection.query('SELECT * from meibo', function (err, rows, fields) {
//      if (err) { console.log('err: ' + err); }
//      console.log(rows[0].id);
//   });
//
// });
