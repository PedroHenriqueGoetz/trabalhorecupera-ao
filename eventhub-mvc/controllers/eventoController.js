const EventoModel = require('../models/eventoModel');
const InscricaoModel = require('../models/inscricaoModel');

const eventoController = {
  /**
   * Lista todos os eventos publicados.
   * @async
   */
  async listar(req, res, next) {
    try {
      const eventos = await EventoModel.listarTodos();
      res.render('eventos/index', { titulo: 'Eventos', eventos });
    } catch (erro) {
      next(erro);
    }
  },

  /** Exibe o formulario de criacao (apenas organizadores). */
  exibirFormularioCriacao(req, res) {
    res.render('eventos/form', { titulo: 'Novo evento', evento: null, erro: null, acao: '/eventos' });
  },

  /**
   * Cria um novo evento vinculado ao organizador logado.
   * @async
   */
  async criar(req, res, next) {
    try {
      const { titulo, descricao, local, dataEvento, vagasTotais } = req.body;
      if (!titulo || !dataEvento) {
        return res.status(400).render('eventos/form', {
          titulo: 'Novo evento', evento: req.body, erro: 'Titulo e data sao obrigatorios.', acao: '/eventos'
        });
      }
      await EventoModel.criar({
        organizadorId: req.session.usuario.id,
        titulo, descricao, local,
        dataEvento,
        vagasTotais: parseInt(vagasTotais, 10) || 0
      });
      res.redirect('/eventos');
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Exibe os detalhes de um evento e a situacao de inscricao do visitante logado.
   * @async
   */
  async exibirDetalhe(req, res, next) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento) {
        return res.status(404).render('erro', { titulo: 'Nao encontrado', mensagem: 'Evento nao encontrado.' });
      }

      let jaInscrito = false;
      if (req.session.usuario) {
        const inscricao = await InscricaoModel.buscarInscricao(evento.id, req.session.usuario.id);
        jaInscrito = !!(inscricao && inscricao.status === 'confirmada');
      }

      res.render('eventos/show', { titulo: evento.titulo, evento, jaInscrito });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Exibe o formulario de edicao, restrito ao organizador dono do evento.
   * @async
   */
  async exibirFormularioEdicao(req, res, next) {
    try {
      const evento = await EventoModel.buscarPorId(req.params.id);
      if (!evento || evento.organizador_id !== req.session.usuario.id) {
        return res.status(403).render('erro', { titulo: 'Acesso negado', mensagem: 'Voce nao pode editar este evento.' });
      }
      res.render('eventos/form', { titulo: 'Editar evento', evento, erro: null, acao: `/eventos/${evento.id}?_method=PUT` });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Atualiza um evento existente, restrito ao organizador dono.
   * @async
   */
  async atualizar(req, res, next) {
    try {
      const { titulo, descricao, local, dataEvento, vagasTotais } = req.body;
      const atualizado = await EventoModel.atualizar(req.params.id, req.session.usuario.id, {
        titulo, descricao, local, dataEvento, vagasTotais: parseInt(vagasTotais, 10) || 0
      });
      if (!atualizado) {
        return res.status(403).render('erro', { titulo: 'Acesso negado', mensagem: 'Voce nao pode editar este evento.' });
      }
      res.redirect(`/eventos/${req.params.id}`);
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Exclui um evento, restrito ao organizador dono.
   * @async
   */
  async excluir(req, res, next) {
    try {
      await EventoModel.excluir(req.params.id, req.session.usuario.id);
      res.redirect('/eventos');
    } catch (erro) {
      next(erro);
    }
  }
};

module.exports = eventoController;
