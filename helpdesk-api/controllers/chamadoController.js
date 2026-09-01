const ChamadoModel = require('../models/chamadoModel');

const chamadoController = {
  /**
   * Lista os chamados visiveis para o usuario autenticado
   * (clientes veem apenas os proprios; tecnicos veem todos).
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async listar(req, res, next) {
    try {
      const chamados = await ChamadoModel.listarParaUsuario(req.usuario);
      res.json(chamados);
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Retorna os detalhes de um chamado, restrito ao cliente dono ou a um tecnico.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async buscarPorId(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) {
        return res.status(404).json({ erro: 'Chamado nao encontrado.' });
      }
      if (req.usuario.papel !== 'tecnico' && chamado.cliente_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao tem acesso a este chamado.' });
      }
      res.json(chamado);
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Abre um novo chamado em nome do cliente autenticado.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async criar(req, res, next) {
    try {
      const { titulo, descricao, prioridade } = req.body;
      if (!titulo) {
        return res.status(400).json({ erro: 'titulo e obrigatorio.' });
      }
      const id = await ChamadoModel.criar({ clienteId: req.usuario.id, titulo, descricao, prioridade });
      const chamado = await ChamadoModel.buscarPorId(id);
      res.status(201).json(chamado);
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Atualiza o status/tecnico responsavel de um chamado. Restrito a tecnicos.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async atualizarStatus(req, res, next) {
    try {
      const statusValidos = ['Aberto', 'Em Atendimento', 'Concluido'];
      const { status } = req.body;
      if (!statusValidos.includes(status)) {
        return res.status(400).json({ erro: `status deve ser um de: ${statusValidos.join(', ')}` });
      }
      const atualizado = await ChamadoModel.atualizarStatus(req.params.id, { status, tecnicoId: req.usuario.id });
      if (!atualizado) {
        return res.status(404).json({ erro: 'Chamado nao encontrado.' });
      }
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      res.json(chamado);
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Exclui um chamado, restrito ao cliente dono ou a um tecnico.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async excluir(req, res, next) {
    try {
      const chamado = await ChamadoModel.buscarPorId(req.params.id);
      if (!chamado) {
        return res.status(404).json({ erro: 'Chamado nao encontrado.' });
      }
      if (req.usuario.papel !== 'tecnico' && chamado.cliente_id !== req.usuario.id) {
        return res.status(403).json({ erro: 'Voce nao pode excluir este chamado.' });
      }
      await ChamadoModel.excluir(req.params.id);
      res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
};

module.exports = chamadoController;
