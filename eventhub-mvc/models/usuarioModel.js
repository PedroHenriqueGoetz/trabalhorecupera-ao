const db = require('../config/db');

/**
 * Camada de acesso a dados da tabela `usuarios`.
 * Todas as consultas usam prepared statements (parametros ?), nunca concatenacao de strings.
 */
const UsuarioModel = {
  /**
   * Busca um usuario pelo email.
   * @async
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async buscarPorEmail(email) {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
    return rows[0] || null;
  },

  /**
   * Busca um usuario pelo id.
   * @async
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async buscarPorId(id) {
    const [rows] = await db.execute('SELECT id, nome, email, papel, criado_em FROM usuarios WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  /**
   * Cria um novo usuario.
   * @async
   * @param {{nome: string, email: string, senhaHash: string, papel: string}} dados
   * @returns {Promise<number>} id do usuario criado
   * @throws {Error} se o email ja estiver cadastrado (constraint UNIQUE)
   */
  async criar({ nome, email, senhaHash, papel }) {
    const [resultado] = await db.execute(
      'INSERT INTO usuarios (nome, email, senha_hash, papel) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, papel]
    );
    return resultado.insertId;
  }
};

module.exports = UsuarioModel;
