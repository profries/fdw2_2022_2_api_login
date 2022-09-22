const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    nome: String,
    email: String,
    senha: String
},
{
    versionKey: false
});

module.exports = mongoose.model("Usuario", UsuarioSchema)