var express = require("../config/express")();
var request = require('supertest')(express);

describe('#ProdutosController', function () {

  beforeEach(function (done) {
    // Ver uma forma
    var conn = express.infra.connectionFactory();
    conn.query("delete from livros",function (err,result) {
      if(!err) {
        done();
      }else{
        console.log(err);
      }
    });
  });

  it('# listagem json', function (done) {
    request.get("/produtos")
    .set("Accept", "application/json")
    .expect("content-type", /json/)
    .expect(200,done);
  })

  it("# Cadastrar novo produto com dados inválidos", function (done) {
    request.post("/produtos")
    .send({nome:""})
    .expect(400,done);
  })

  it("# Cadastrar novo produto com dados válidos", function (done) {
    request.post("/produtos")
    .send({nome:"Teste"})
    .expect(302, done)
  })

});
