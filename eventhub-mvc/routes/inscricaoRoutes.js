const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/inscricaoController');
const { exigirLogin } = require('../middlewares/authMiddleware');

router.get('/minhas', exigirLogin, inscricaoController.minhasInscricoes);
router.post('/:eventoId', exigirLogin, inscricaoController.inscrever);
router.delete('/:eventoId', exigirLogin, inscricaoController.cancelar);

module.exports = router;
