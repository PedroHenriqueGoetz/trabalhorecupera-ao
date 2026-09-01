const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuarioModel');

const authController = {
  /**
   * Registra um novo usuario (cliente ou tecnico) com senha protegida por bcrypt.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   * @throws {Error} repassado ao middleware de erro em falhas inesperadas de banco
   */
  async registrar(req, res, next) {
    try {
      const { nome, email, senha, papel } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'nome, email e senha sao obrigatorios.' });
      }

      const existente = await UsuarioModel.buscarPorEmail(email);
      if (existente) {
        return res.status(409).json({ erro: 'Este email ja esta cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);
      const papelValido = papel === 'tecnico' ? 'tecnico' : 'cliente';
      const id = await UsuarioModel.criar({ nome, email, senhaHash, papel: papelValido });

      res.status(201).json({ id, nome, email, papel: papelValido });
    } catch (erro) {
      next(erro);
    }
  },

  /**
   * Autentica um usuario e retorna um JWT valido por JWT_EXPIRES_IN.
   * @async
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   * @returns {Promise<void>}
   */
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const usuario = await UsuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais invalidas.' });
      }

      const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaConfere) {
        return res.status(401).json({ erro: 'Credenciais invalidas.' });
      }

      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );

      res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel } });
    } catch (erro) {
      next(erro);
    }
  }
};

module.exports = authController;
