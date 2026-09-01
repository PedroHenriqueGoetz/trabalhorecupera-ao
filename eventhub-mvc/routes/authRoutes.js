const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/cadastro', authController.exibirCadastro);
router.post('/cadastro', authController.cadastrar);
router.get('/login', authController.exibirLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
