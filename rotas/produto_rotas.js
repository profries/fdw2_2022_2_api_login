const express = require('express');
const produtoController = require('../controller/produto_controller')

const router = express.Router();
//Rota do recurso: "/api/produtos"

router.get('/', produtoController.listar)
router.post('/', produtoController.inserir)
router.get('/:id', produtoController.buscarPorId)
router.put('/:id', produtoController.atualizar)
router.delete('/:id', produtoController.deletar)

module.exports = router;