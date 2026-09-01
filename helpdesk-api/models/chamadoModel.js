const db = require('../config/db');

/**
 * Camada de acesso a dados da tabela `chamados`.
 */
const ChamadoModel = {
  /**
   * Lista chamados visiveis para o usuario: clientes veem apenas os proprios,
   * tecnicos veem todos.
   * @async
   * @param {{id: number, papel: string}} usuario
   * @returns {Promise<Array<Object>>}
   */
  async listarParaUsuario(usuario) {
    if (usuario.papel === 'tecnico') {
      const [rows] = await db.execute(`
        SELECT c.*, cli.nome AS cliente_nome, tec.nome AS tecnico_nome
        FROM chamados c
        JOIN usuarios cli ON cli.id = c.cliente_id
        LEFT JOIN usuarios tec ON tec.id = c.tecnico_id
        ORDER BY c.criado_em DESC
      `);
      return rows;
    }
    const [rows] = await db.execute(`
      SELECT c.*, cli.nome AS cliente_nome, tec.nome AS tecnico_nome
      FROM chamados c
      JOIN usuarios cli ON cli.id = c.cliente_id
      LEFT JOIN usuarios tec ON tec.id = c.tecnico_id
      WHERE c.cliente_id = ?
      ORDER BY c.criado_em DESC
    `, [usuario.id]);
    return rows;
  },

  /**
   * Busca um chamado pelo id.
   * @async
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async buscarPorId(id) {
    const [rows] = await db.execute(`
      SELECT c.*, cli.nome AS cliente_nome, tec.nome AS tecnico_nome
      FROM chamados c
      JOIN usuarios cli ON cli.id = c.cliente_id
      LEFT JOIN usuarios tec ON tec.id = c.tecnico_id
      WHERE c.id = ?
      LIMIT 1
    `, [id]);
    return rows[0] || null;
  },

  /**
   * Cria um novo chamado em nome do cliente autenticado.
   * @async
   * @param {{clienteId: number, titulo: string, descricao: string, prioridade: string}} dados
   * @returns {Promise<number>} id do chamado criado
   */
  async criar({ clienteId, titulo, descricao, prioridade }) {
    const [resultado] = await db.execute(
      'INSERT INTO chamados (cliente_id, titulo, descricao, prioridade) VALUES (?, ?, ?, ?)',
      [clienteId, titulo, descricao, prioridade || 'Media']
    );
    return resultado.insertId;
  },

  /**
   * Atualiza status, prioridade e/ou tecnico responsavel de um chamado. Restrito a tecnicos.
   * @async
   * @param {number} id
   * @param {{status: string, tecnicoId: number|null}} dados
   * @returns {Promise<boolean>}
   */
  async atualizarStatus(id, { status, tecnicoId }) {
    const [resultado] = await db.execute(
      'UPDATE chamados SET status = ?, tecnico_id = ? WHERE id = ?',
      [status, tecnicoId, id]
    );
    return resultado.affectedRows > 0;
  },

  /**
   * Exclui um chamado. Restrito ao cliente dono ou a um tecnico.
   * @async
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async excluir(id) {
    const [resultado] = await db.execute('DELETE FROM chamados WHERE id = ?', [id]);
    return resultado.affectedRows > 0;
  }
};

module.exports = ChamadoModel;
