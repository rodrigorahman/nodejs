module.exports = function (app) {
  app.get("/",function (req,res,next) {
    res.render("index", {livros: [{id:1, titulo: 'nome'},{id:1, titulo: 'nome'},{id:1, titulo: 'nome'}] });
  })
}
