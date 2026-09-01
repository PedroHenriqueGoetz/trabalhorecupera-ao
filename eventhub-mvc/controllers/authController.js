const bcrypt = require('bcryptjs');
const UsuarioModel = require('../models/usuarioModel');

const authController = {
  /** Exibe o formulario de cadastro. */
  exibirCadastro(req, res) {
    res.render('cadastro', { titulo: 'Criar conta', erro: null });
  },

  /**
   * Processa o cadastro de um novo usuario, com senha protegida por bcrypt.
   * @async
   * @throws {Error} repassado ao middleware de erro em falhas inesperadas de banco
   */
  async cadastrar(req, res, next) {
    try {
      const { nome, email, senha, papel } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).render('cadastro', { titulo: 'Criar conta', erro: 'Preencha todos os campos.' });
      }

      const existente = await UsuarioModel.buscarPorEmail(email);
      if (existente) {
        return res.status(409).render('cadastro', { titulo: 'Criar conta', erro: 'Este email ja esta cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const papelValido = papel === 'organizador' ? 'organizador' : 'participante';

      await UsuarioModel.criar({ nome, email, senhaHash, papel: papelValido });
      res.redirect('/login');
    } catch (erro) {
      next(erro);
    }
  },

  /** Exibe o formulario de login. */
  exibirLogin(req, res) {
    res.render('login', { titulo: 'Entrar', erro: null });
  },

  /**
   * Autentica o usuario e grava os dados essenciais na sessao.
   * @async
   */
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const usuario = await UsuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).render('login', { titulo: 'Entrar', erro: 'Email ou senha invalidos.' });
      }

      const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaConfere) {
        return res.status(401).render('login', { titulo: 'Entrar', erro: 'Email ou senha invalidos.' });
      }

      req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel };
      res.redirect('/eventos');
    } catch (erro) {
      next(erro);
    }
  },

  /** Encerra a sessao do usuario. */
  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie('eventhub.sid');
      res.redirect('/login');
    });
  }
};

module.exports = authController;
