
module.exports = function(app) {



  app.get("/produtos", function(req,res,next){

    var connection = app.infra.connectionFactory();
    var produtosDAO = new app.infra.ProdutosDAO(connection);

    produtosDAO.lista(function(err, results){

      // Enviando para o expresso tratar o erro
      if(err) return next(err);

      res.format({
        html: function () {
            res.render("produtos/lista", {lista : results});
        },
        json: function () {
          res.json(results);
        }
      });


    })
    connection.end();
  });

  app.get("/produtos/form", function (req,res) {
    res.render("produtos/form", {errosValidacao:{}, produto:{}});
  })

  app.post("/produtos", function (req,res) {

    var tituloValidator = req.assert('nome', 'Nome é obrigatório').notEmpty();
    var produto = req.body;
    var erros = req.validationErrors();

    if(erros){

      res.format({
        html: function () {
          res.status(400).render('produtos/form', {errosValidacao: erros, produto: produto});
        },
        json: function () {
          res.status(400).json(erros);
        }
      })

      return;
    }

    var connection = app.infra.connectionFactory();
    var produtosDAO = new app.infra.ProdutosDAO(connection);


    produtosDAO.salvar(produto, function (erros,resultados) {
      if(erros){
        return next(erros);
      }
      res.redirect("/produtos")
    })

    connection.end();
  })

}
