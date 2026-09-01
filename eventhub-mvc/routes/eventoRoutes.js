const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { exigirLogin, exigirOrganizador } = require('../middlewares/authMiddleware');

router.get('/', eventoController.listar);
router.get('/novo', exigirOrganizador, eventoController.exibirFormularioCriacao);
router.post('/', exigirOrganizador, eventoController.criar);
router.get('/:id', eventoController.exibirDetalhe);
router.get('/:id/editar', exigirOrganizador, eventoController.exibirFormularioEdicao);
router.put('/:id', exigirOrganizador, eventoController.atualizar);
router.delete('/:id', exigirOrganizador, eventoController.excluir);

module.exports = router;
