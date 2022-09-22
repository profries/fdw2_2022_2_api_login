const express = require('express')
const mongoose = require('mongoose') 
const rotaProduto = require('./rotas/produto_rotas')
const rotaUsuario = require('./rotas/usuario_rotas')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const trataLog = (req, res, next) => {
  console.log("Metodo", req.method);  
  console.log("URI", req.originalUrl);
  next();
  console.log("Status",res.statusCode);
}

//Configuração da conexão com o Mongo
mongoose.connect('mongodb://127.0.0.1:27017/app_produtos')
  .then(() => {
    console.log("Conectado ao Mongo..");
  }).catch((error) => { 
    console.log("Erro>:", error) 
  });

app.use(trataLog);

app.use('/api/produtos', rotaProduto);

app.use('/api/usuarios', rotaUsuario);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})