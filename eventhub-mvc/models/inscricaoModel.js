const db = require('../config/db');

/**
 * Camada de acesso a dados da tabela `inscricoes`.
 */
const InscricaoModel = {
  /**
   * Verifica se um participante ja possui inscricao confirmada em um evento.
   * @async
   * @param {number} eventoId
   * @param {number} participanteId
   * @returns {Promise<Object|null>}
   */
  async buscarInscricao(eventoId, participanteId) {
    const [rows] = await db.execute(
      'SELECT * FROM inscricoes WHERE evento_id = ? AND participante_id = ? LIMIT 1',
      [eventoId, participanteId]
    );
    return rows[0] || null;
  },

  /**
   * Cria uma inscricao confirmada, reativando-a caso ja exista uma cancelada.
   * @async
   * @param {number} eventoId
   * @param {number} participanteId
   * @returns {Promise<void>}
   */
  async inscrever(eventoId, participanteId) {
    await db.execute(
      `INSERT INTO inscricoes (evento_id, participante_id, status)
       VALUES (?, ?, 'confirmada')
       ON DUPLICATE KEY UPDATE status = 'confirmada', inscrito_em = CURRENT_TIMESTAMP`,
      [eventoId, participanteId]
    );
  },

  /**
   * Cancela a inscricao de um participante em um evento.
   * @async
   * @param {number} eventoId
   * @param {number} participanteId
   * @returns {Promise<boolean>}
   */
  async cancelar(eventoId, participanteId) {
    const [resultado] = await db.execute(
      "UPDATE inscricoes SET status = 'cancelada' WHERE evento_id = ? AND participante_id = ?",
      [eventoId, participanteId]
    );
    return resultado.affectedRows > 0;
  },

  /**
   * Lista as inscricoes confirmadas de um participante, com dados do evento.
   * @async
   * @param {number} participanteId
   * @returns {Promise<Array<Object>>}
   */
  async listarPorParticipante(participanteId) {
    const [rows] = await db.execute(`
      SELECT i.*, e.titulo, e.data_evento, e.local
      FROM inscricoes i
      JOIN eventos e ON e.id = i.evento_id
      WHERE i.participante_id = ? AND i.status = 'confirmada'
      ORDER BY e.data_evento ASC
    `, [participanteId]);
    return rows;
  }
};

module.exports = InscricaoModel;
