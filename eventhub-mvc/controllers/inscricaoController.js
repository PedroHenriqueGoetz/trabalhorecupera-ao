const EventoModel = require('../models/eventoModel');
const InscricaoModel = require('../models/inscricaoModel');

const inscricaoController = {
  /**
   * Inscreve o participante logado no evento informado, respeitando o limite de vagas.
   * @async
   */
  async inscrever(req, res, next) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.eventoId);
      if (!evento) {
        return res.status(404).render('erro', { titulo: 'Nao encontrado', mensagem: 'Evento nao encontrado.' });
      }
      if (evento.vagas_totais > 0 && evento.inscritos >= evento.vagas_totais) {
        return res.status(400).render('erro', { titulo: 'Vagas esgotadas', mensagem: 'Este evento nao possui mais vagas disponiveis.' });
      }
      await InscricaoModel.inscrever(evento.id, req.session.usuario.id);
      res.redirect(`/eventos/${evento.id}`);
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Cancela a inscricao do participante logado no evento informado.
   * @async
   */
  async cancelar(req, res, next) {
    try {
      await InscricaoModel.cancelar(req.params.eventoId, req.session.usuario.id);
      res.redirect(`/eventos/${req.params.eventoId}`);
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Lista as inscricoes confirmadas do participante logado.
   * @async
   */
  async minhasInscricoes(req, res, next) {
    try {
      const inscricoes = await InscricaoModel.listarPorParticipante(req.session.usuario.id);
      res.render('minhas-inscricoes', { titulo: 'Minhas inscricoes', inscricoes });
    } catch (erro) {
      next(erro);
    }
  }
};

module.exports = inscricaoController;
