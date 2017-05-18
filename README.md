## Refresh automatico do node server
**nodemon**
http://nodemon.io/

***Instalando***
```
npm install -g nodemon
```
No MAC não instalou de primeira tive que colocar o npm nas variaveis de ambiente:

```
export NPM_HOME=/usr/local/Cellar/node/5.10.1/libexec/npm/bin/
export PATH=$PATH:$NPM_HOME
```

**EJS**
http://www.embeddedjs.com/

Engine de view

## Criando modulos ##
O node utiliza o padrão commons-js

Criando um modulo para carregar o express, como vamos carregar somente uma vez criamos as variaveis fora
e adicionamos no export do modulo somente o retorno da variavel, sendo assim a variavel só irá carregar uma vez

```
var app = require('express')();
app.set("view engine", "ejs");

module.exports = function() {
  console.log("Modulo Express Config Carregado");
  return app;
}
```

## Conectando com Mysql ##

Driver:

```
npm install mysql -save
```

Código simples:

```
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "9330923a",
  database: "casadocodigo"
});

connection.query("select * from livros", function(err, results){
  console.log(results);
});

```

***Para fazer um insert o driver possibilita utilizar o atributo "SET":***


Ex:
  insert into produto set ?


Set ?: O Driver irá substituir a partir de um json para fazer o insert ex:
Minha tabela produto:
  id autoincrement
  nome varchar()

```
var produto = {
  id: null,
  nome: "nome"
}

connection.query("select * from livros set ?", produto, callbak);
```
##Exemplo de um ConnectionFactory ##
```
var mysql = require('mysql')
    , fs = require('fs');

function ConnectionFactory() {

    if (!global.database) {
        console.log("Lendo o arquivo de Configuracao");
        console.log(JSON.parse(fs.readFileSync(process.env['ORTHOAXIS_HOME'] + "/database.json", 'utf8')));
        global.database = JSON.parse(fs.readFileSync(process.env['ORTHOAXIS_HOME'] + "/database.json", 'utf8'));
    }
    this._connection = mysql.createPool(global.database);
    // this._results = [];

    return this;
};

ConnectionFactory.prototype.getConnection = function (callback) {
    return this._connection.getConnection(callback);
};

module.exports = function () {
    return ConnectionFactory;
};
```

##Exemplo de Controle de Transacao##
```
CadastroPersistence.prototype.teste = function () {

    this._connectionFactory.getConnection(function (err, connection) {
       connection.beginTransaction(function (err) {
           if(err) {
               LOG.error(err);
               throw err;
           }


           connection.query('insert into teste values(?)',"Rodrigo", function (err, result) {
               if(err){
                   LOG.error(err);
                   return connection.rollback(function () {
                       throw err;
                   });
               }

               connection.query("insert into teste values(?)", "Luana", function (err, result) {
                   if(err){
                       LOG.error(err);
                       return connection.rollback(function () {
                           throw err;
                       });
                   }
                   connection.commit(function (err) {
                       if(err){
                           LOG.error(err);
                           return connection.rollback(function () {
                               throw err;
                           });
                       }
                       console.log("Comitado");
                   })

               })
           })

       })
    });
};
```


## Load automatico de modulos (Deprecated utilize Consign)

**express-load**
```
npm install express-load --save
```

**Carregando**

```
var load = require('express-load');
load('routes', {cwd: 'app'})
  .then('infra')
  .into(app);
```

```
cwd -> Restringe a pasta de busca dos modulos
into -> está carregando o modulo e jogando dentro da variavel app
```

***Para buscar os modulos dentro do app utilizar:***
```
app.<modulo> ex:

app.infra.connectionFactory
```


## No Express Middleware ##
Você pode fazer com que ele execute diversas requisições express.use é aplicado
no request na ordem de execução ex:

```
var app = express();
// Transforma o form em um JSON
app.use(bodyParser.urlencoded({extended: true}));
```

## Adicionando suporte a json no express ##
```
var app = express();
// Adicionando suporte ao json
app.use(bodyParser.json());
```

## Validação ##

Para fazer validações utilizamos:

```
npm install express-validator --save
```


## Consign ##



## Test ##

```
npm install mocha --save-dev
```

Para testar requisicoes assincronas devemos passar uma funcao para denro o it assim o mocha sabe que deve esperar essa funcao ser chamada para finalizar o teste ex de código:

```
var http = require('http');
describe('#ProdutosController', function () {

  it('#listagem json', function (done) {
    var configuracoes = {
      hostname: "localhost",
      port: 3000,
      path: '/produtos',
      headers: {
        'Accept':'application/json'
      }
    };

    http.get(configuracoes, function(res){
      if(res.statusCode == 200){
        console.log("status ok");
      }
      if(res.headers['Content-type'] == "application/json; charset=utf-8"){
        console.log('Content-type: OK');
      }
      done();
    });

  })

});
```

***Biblioteca de assert do node***
```
var assert = require('assert');

assert.equal(res.statusCode,200)
assert.equal(res.headers['content-type'],'application/json; charset=utf-8');

```

## Analisar lib ##

```
node-database-cleaner
```

## Adicionando conteudo estático ##

Adiciona um caminho statico no projeto

```
express.static

app.use(express.static('./app/public/'))

```

## Express ##

Adicionando variaveis no express

```
app.set('io', io);
```

## Socket IO ##

***Instalação***
```
npm install socket.io --save
```

***Configuração***

index.ejs:

***Adicionando no listener***

```
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
  socket.on('novaPromocao',function (data) {
    alert("Livro em promocoao: " + data.livro.id);
  })
</script>
```

***Iniciando Socket.io***
```
// recuperando http Server - Server é o Handler responsavel pela renderização
// O Socket.io precisa dele para iniciar

var http = require('http').Server(app);
var io = require("socket.io")(http);

app.set('io', io);
// Já que temos o http do node melhor iniciar o server por ele
http.listen(3000, function(){
  console.log("servidor rodando")
});
```

***Enviando a mensagem***
```
var promocoes = {id: 1};
app.get('io').emit("novaPromocao", promocoes);
```
