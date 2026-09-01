const ChamadoModel = require('../models/chamadoModel');
const ComentarioModel = require('../models/comentarioModel');

const comentarioController = {
  /**
   * Lista os comentarios de um chamado, restrito ao cliente dono ou a um tecnico.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async listar(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.chamadoId);
      if (!chamado) {
        return res.status(404).json({ erro: 'Chamado nao encontrado.' });
      }
      if (req.usuario.papel !== 'tecnico' && chamado.cliente_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao tem acesso a este chamado.' });
      }
      const comentarios = await ComentarioModel.listarPorChamado(req.params.chamadoId);
      res.json(comentarios);
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Adiciona um comentario a um chamado, restrito ao cliente dono ou a um tecnico.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async criar(req, res, next) {
    try {
      const { mensagem } = req.body;
      if (!mensagem) {
        return res.status(400).json({ erro: 'mensagem e obrigatoria.' });
      }
      const chamado = await ChamadoModel.buscarPorId(req.params.chamadoId);
      if (!chamado) {
        return res.status(404).json({ erro: 'Chamado nao encontrado.' });
      }
      if (req.usuario.papel !== 'tecnico' && chamado.cliente_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao tem acesso a este chamado.' });
      }
      const id = await ComentarioModel.criar({ chamadoId: req.params.chamadoId, autorId: req.usuario.id, mensagem });
      res.status(201).json({ id, chamadoId: Number(req.params.chamadoId), autorId: req.usuario.id, mensagem });
    } catch (erro) {
      next(erro);
    }
  }
};

module.exports = comentarioController;
