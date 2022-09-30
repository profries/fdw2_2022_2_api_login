const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Usuario = require('../model/usuario');

exports.listar = (req, res) => {
    Usuario.find({}, (err, usuarios) =>{ 
        if(err) {
            res.status(500).json({Erro: err})
        }
        else {
            res.status(200).json(usuarios);
        }
    })
}

exports.inserir = (req, res) => {
    const usuarioRequest = req.body;
    if(usuarioRequest && usuarioRequest.nome 
        && usuarioRequest.email && usuarioRequest.senha) {

        const usuarioNovo = new Usuario(usuarioRequest);
        console.log("Senha 1", usuarioNovo.senha);
        usuarioNovo.senha = bcrypt.hashSync(usuarioRequest.senha, 10);
        console.log("Senha 2", usuarioNovo.senha);

        usuarioNovo.save((err, usuarioSalvo) => {
            if(err) {
                res.status(500).json({Erro: err})
            }
            else {
                return res.status(201).json(usuarioSalvo);
            }
        })
        
    }
    else {
        return res.status(400).json({
            Erro:"Nome, email e/ou senha sao obrigatorios"
        })
    }
}

exports.buscarPorId = (req, res) => {
    const id = req.params.id;

    Usuario.findById(id, (err, usuarioEncontrado) => {
        if(err) {
            res.status(500).json({Erro: err}); 
        }
        else if(usuarioEncontrado) {
            return res.json(usuarioEncontrado);
        }
        else {
            return res.status(404).json(
                { Erro: "Usuario nao encontrado" }
            )
        }
    
    })
}

exports.atualizar = (req, res) => {
    const id = req.params.id;
    const usuarioRequest = req.body;

    if(!usuarioRequest || !usuarioRequest.nome 
        || !usuarioRequest.email) {
        return res.status(400).json({
            Erro:"Nome e/ou email sao obrigatorios"
        });    
    }
    if(usuarioRequest.senha) {
        usuarioRequest.senha = bcrypt.hashSync(usuarioRequest.senha, 10);
    }

    Usuario.findByIdAndUpdate(id, usuarioRequest, {new: true}, 
        (err, usuarioAtualizado) => {
            if(err) {
                res.status(500).json({Erro: err}); 
            }
            else if(usuarioAtualizado) {
                return res.json(usuarioAtualizado);
            }
            else {
                return res.status(404).json(
                    { Erro: "Usuario nao encontrado" }
                )
            }
        })
    }

exports.deletar = (req, res) => {
    const id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioDeletado) => {
        if(err) {
            return res.status(500).json({Erro: err}); 
        }
        else if(usuarioDeletado) {
            return res.json(usuarioDeletado);
        }
        else {
            return res.status(404).json(
                { Erro: "Usuario nao encontrado" }
            )    
        }
    })    
}

exports.buscarUsuario = (req, res) => {
    if(req.query && req.query.email) {
        const paramEmail = req.query.email;
        Usuario.findOne({email: paramEmail}, (err, usuarioEncontrado) => {
            if(err) {
                return res.status(500).json({Erro: err}); 
            }
            else if(usuarioEncontrado) {
                return res.json(usuarioEncontrado);
            }
            else {
                return res.status(404).json(
                    { Erro: "Usuario nao encontrado" }
                )    
            }    
        })
    }
    else {
        res.status(400).json({Erro: "Faltou o parametro email"});
    }
}

exports.validarUsuario = (req, res) => {
    if(req.body && req.body.email && req.body.senha) {
        const emailUsuario = req.body.email;
        const senhaUsuario = req.body.senha;

        Usuario.findOne({email: emailUsuario}, (err, usuarioEncontrado) => {
            if(err) {
                return res.status(500).json({Erro: err}); 
            }
            else if(usuarioEncontrado && bcrypt.compareSync(senhaUsuario, usuarioEncontrado.senha)) {
                const token = jwt.sign( {
                    id: usuarioEncontrado.id                    
                }, 'Sen@crs', { expiresIn: "1h"});
                res.status(201).json({token: token});
            }
            else {
                res.status(401).json({Erro: "Usuario ou senha invalidos"});
            }    
        })
    }
    else {
        res.status(400).json({Erro: "Parametros invalidos"});
    }   
}

