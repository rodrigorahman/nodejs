module.exports = function (app) {
  app.get("/promocoes/form", function (req,res, next) {
    var connection = app.infra.connectionFactory();
    var produtosDAO = new app.infra.ProdutosDAO(connection);

    produtosDAO.lista(function(err, results){
      if(err) return next(err);

      res.render('promocoes/form',{lista: results});
    });
    connection.end();
  });

  app.post("/promocoes", function (req,res) {
    var promocoes = req.body;
    app.get('io').emit("novaPromocao", promocoes);
    return res.redirect("promocoes/form");
  })
}
