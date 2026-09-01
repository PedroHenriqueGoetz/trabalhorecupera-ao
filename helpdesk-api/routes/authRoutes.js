const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @openapi
 * /auth/registrar:
 *   post:
 *     summary: Cadastra um novo usuario (cliente ou tecnico)
 *     tags: [Autenticacao]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome: { type: string, example: "Maria Souza" }
 *               email: { type: string, example: "maria@exemplo.com" }
 *               senha: { type: string, example: "senhaSegura123" }
 *               papel: { type: string, enum: [cliente, tecnico], example: "cliente" }
 *     responses:
 *       201: { description: Usuario criado }
 *       400: { description: Dados invalidos }
 *       409: { description: Email ja cadastrado }
 */
router.post('/registrar', authController.registrar);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autentica um usuario e retorna um token JWT
 *     tags: [Autenticacao]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email: { type: string, example: "maria@exemplo.com" }
 *               senha: { type: string, example: "senhaSegura123" }
 *     responses:
 *       200: { description: Login efetuado, retorna token JWT }
 *       401: { description: Credenciais invalidas }
 */
router.post('/login', authController.login);

module.exports = router;
