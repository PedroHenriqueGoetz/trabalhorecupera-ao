const express = require('express');
const router = express.Router();
const chamadoController = require('../controllers/chamadoController');
const comentarioController = require('../controllers/comentarioController');
const { exigirAutenticacao, exigirTecnico } = require('../middlewares/authMiddleware');

router.use(exigirAutenticacao);

/**
 * @openapi
 * /chamados:
 *   get:
 *     summary: Lista os chamados visiveis para o usuario autenticado
 *     tags: [Chamados]
 *     responses:
 *       200: { description: Lista de chamados }
 *       401: { description: Nao autenticado }
 *   post:
 *     summary: Abre um novo chamado
 *     tags: [Chamados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo]
 *             properties:
 *               titulo: { type: string, example: "Impressora nao imprime" }
 *               descricao: { type: string, example: "A impressora do 3o andar nao liga." }
 *               prioridade: { type: string, enum: [Baixa, Media, Alta], example: "Media" }
 *     responses:
 *       201: { description: Chamado criado }
 *       400: { description: Dados invalidos }
 */
router.get('/', chamadoController.listar);
router.post('/', chamadoController.criar);

/**
 * @openapi
 * /chamados/{id}:
 *   get:
 *     summary: Retorna os detalhes de um chamado
 *     tags: [Chamados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Detalhes do chamado }
 *       403: { description: Acesso negado }
 *       404: { description: Chamado nao encontrado }
 *   delete:
 *     summary: Exclui um chamado
 *     tags: [Chamados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Chamado excluido }
 *       403: { description: Acesso negado }
 *       404: { description: Chamado nao encontrado }
 */
router.get('/:id', chamadoController.buscarPorId);
router.delete('/:id', chamadoController.excluir);

/**
 * @openapi
 * /chamados/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um chamado (apenas tecnicos)
 *     tags: [Chamados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [Aberto, "Em Atendimento", Concluido] }
 *     responses:
 *       200: { description: Chamado atualizado }
 *       403: { description: Apenas tecnicos podem atualizar o status }
 *       404: { description: Chamado nao encontrado }
 */
router.patch('/:id/status', exigirTecnico, chamadoController.atualizarStatus);

/**
 * @openapi
 * /chamados/{chamadoId}/comentarios:
 *   get:
 *     summary: Lista os comentarios de um chamado
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Lista de comentarios }
 *       403: { description: Acesso negado }
 *       404: { description: Chamado nao encontrado }
 *   post:
 *     summary: Adiciona um comentario a um chamado
 *     tags: [Comentarios]
 *     parameters:
 *       - in: path
 *         name: chamadoId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mensagem]
 *             properties:
 *               mensagem: { type: string, example: "Ja verificamos o cabo de energia." }
 *     responses:
 *       201: { description: Comentario criado }
 *       403: { description: Acesso negado }
 *       404: { description: Chamado nao encontrado }
 */
router.get('/:chamadoId/comentarios', comentarioController.listar);
router.post('/:chamadoId/comentarios', comentarioController.criar);

module.exports = router;
