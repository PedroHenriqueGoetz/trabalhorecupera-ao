const db = require('../config/db');

/**
 * Camada de acesso a dados da tabela `comentarios_chamado`.
 */
const ComentarioModel = {
  /**
   * Lista os comentarios de um chamado, do mais antigo para o mais recente.
   * @async
   * @param {number} chamadoId
   * @returns {Promise<Array<Object>>}
   */
  async listarPorChamado(chamadoId) {
    const [rows] = await db.execute(`
      SELECT cc.*, u.nome AS autor_nome, u.papel AS autor_papel
      FROM comentarios_chamado cc
      JOIN usuarios u ON u.id = cc.autor_id
      WHERE cc.chamado_id = ?
      ORDER BY cc.criado_em ASC
    `, [chamadoId]);
    return rows;
  },

  /**
   * Adiciona um comentario a um chamado.
   * @async
   * @param {{chamadoId: number, autorId: number, mensagem: string}} dados
   * @returns {Promise<number>} id do comentario criado
   */
  async criar({ chamadoId, autorId, mensagem }) {
    const [resultado] = await db.execute(
      'INSERT INTO comentarios_chamado (chamado_id, autor_id, mensagem) VALUES (?, ?, ?)',
      [chamadoId, autorId, mensagem]
    );
    return resultado.insertId;
  }
};

module.exports = ComentarioModel;
