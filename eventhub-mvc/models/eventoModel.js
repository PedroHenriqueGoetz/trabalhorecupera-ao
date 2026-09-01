const db = require('../config/db');

/**
 * Camada de acesso a dados da tabela `eventos`.
 */
const EventoModel = {
  /**
   * Lista todos os eventos, do mais recente para o mais antigo, com contagem de inscritos.
   * @async
   * @returns {Promise<Array<Object>>}
   */
  async listarTodos() {
    const [rows] = await db.execute(`
      SELECT e.*, u.nome AS organizador_nome,
        (SELECT COUNT(*) FROM inscricoes i WHERE i.evento_id = e.id AND i.status = 'confirmada') AS inscritos
      FROM eventos e
      JOIN usuarios u ON u.id = e.organizador_id
      ORDER BY e.data_evento ASC
    `);
    return rows;
  },

  /**
   * Busca um evento pelo id, incluindo contagem de inscritos.
   * @async
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT e.*, u.nome AS organizador_nome,
        (SELECT COUNT(*) FROM inscricoes i WHERE i.evento_id = e.id AND i.status = 'confirmada') AS inscritos
      FROM eventos e
      JOIN usuarios u ON u.id = e.organizador_id
      WHERE e.id = ?
      LIMIT 1
    `, [id]);
    return rows[0] || null;
  },

  /**
   * Lista eventos criados por um organizador especifico.
   * @async
   * @param {number} organizadorId
   * @returns {Promise<Array<Object>>}
   */
  async listarPorOrganizador(organizadorId) {
    const [rows] = await db.execute(
      'SELECT * FROM eventos WHERE organizador_id = ? ORDER BY data_evento ASC',
      [organizadorId]
    );
    return rows;
  },

  /**
   * Cria um novo evento.
   * @async
   * @param {{organizadorId: number, titulo: string, descricao: string, local: string, dataEvento: string, vagasTotais: number}} dados
   * @returns {Promise<number>} id do evento criado
   */
  async criar({ organizadorId, titulo, descricao, local, dataEvento, vagasTotais }) {
    const [resultado] = await db.execute(
      `INSERT INTO eventos (organizador_id, titulo, descricao, local, data_evento, vagas_totais)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [organizadorId, titulo, descricao, local, dataEvento, vagasTotais]
    );
    return resultado.insertId;
  },

  /**
   * Atualiza um evento existente, restrito ao organizador dono do evento.
   * @async
   * @param {number} id
   * @param {number} organizadorId
   * @param {{titulo: string, descricao: string, local: string, dataEvento: string, vagasTotais: number}} dados
   * @returns {Promise<boolean>} true se alguma linha foi alterada
   */
  async atualizar(id, organizadorId, { titulo, descricao, local, dataEvento, vagasTotais }) {
    const [resultado] = await db.execute(
      `UPDATE eventos SET titulo = ?, descricao = ?, local = ?, data_evento = ?, vagas_totais = ?
       WHERE id = ? AND organizador_id = ?`,
      [titulo, descricao, local, dataEvento, vagasTotais, id, organizadorId]
    );
    return resultado.affectedRows > 0;
  },

  /**
   * Exclui um evento, restrito ao organizador dono do evento.
   * @async
   * @param {number} id
   * @param {number} organizadorId
   * @returns {Promise<boolean>} true se alguma linha foi excluida
   */
  async excluir(id, organizadorId) {
    const [resultado] = await db.execute(
      'DELETE FROM eventos WHERE id = ? AND organizador_id = ?',
      [id, organizadorId]
    );
    return resultado.affectedRows > 0;
  }
};

module.exports = EventoModel;
