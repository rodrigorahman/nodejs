var http = require('http');

var configuracoes = {
  hostname : 'localhost',
  port: 3000,
  path: '/produtos',
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-type' : 'application/json'
  }
}

var client = http.request(configuracoes, function (res) {
  console.log(res.statusCode);
  res.on('data', function (body) {
    console.log('copo:' + body);
  })
})


var produto = {
  nome: 'mais sobre node'
};

produto = {id:123};
client.end(JSON.stringify(produto));
