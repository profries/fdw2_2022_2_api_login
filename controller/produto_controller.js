const Produto = require("../model/produto");


exports.listar = (req, res) => {
    Produto.find({}, (err, produtos) => {
        if(err){
            res.status(500).send(err);
        }
        res.json(produtos);
    })
}

exports.inserir = (req, res) => {
    const produtoRequest = req.body;
    if(produtoRequest && produtoRequest.nome && produtoRequest.preco) {

        const produtoNovo = new Produto(produtoRequest);
        produtoNovo.save((err, produtoSalvo) => {
            if(err) {
                res.status(500).send(err);
            }
            else {
                return res.status(201).json(produtoSalvo);
            }
        })
        
    }
    else {
        return res.status(400).json({
            Erro:"Nome e/ou preco sao obrigatorios"
        })
    }
}

exports.buscarPorId = (req, res) => {
    const id = req.params.id;

    //Produto.findOne({_id: id}, (err, produtoEncontrado) => {   
    Produto.findById(id, (err, produtoEncontrado) => {
        if(err) {
            res.status(500).send(err); 
        }
        else if(produtoEncontrado) {
            return res.json(produtoEncontrado);
        }
        else {
            return res.status(404).json(
                { Erro: "Produto nao encontrado" }
            )
        }
    
    })
}

exports.atualizar = (req, res) => {
    const id = req.params.id;
    const produtoRequest = req.body;

    if(!produtoRequest || !produtoRequest.nome || !produtoRequest.preco) {
        return res.status(400).json({
            Erro:"Nome e/ou preco sao obrigatorios"
        });    
    }

    Produto.findByIdAndUpdate(id, produtoRequest, {new: true}, 
        (err, produtoAtualizado) => {
            if(err) {
                res.status(500).send(err)
            }
            else if(produtoAtualizado) {
                return res.json(produtoAtualizado);
            }
            else {
                return res.status(404).json(
                    { Erro: "Produto nao encontrado" }
                )
            }
        })
    }

exports.deletar = (req, res) => {
    const id = req.params.id;

    Produto.findByIdAndDelete(id, (err, produtoDeletado) => {
        if(err) {
            return res.status(500).send(err);
        }
        else if(produtoDeletado) {
            return res.json(produtoDeletado);
        }
        else {
            return res.status(404).json(
                { Erro: "Produto nao encontrado" }
            )    
        }
    })    
}
