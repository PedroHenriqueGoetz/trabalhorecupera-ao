-- HelpDesk API - Schema do banco de dados (MySQL)

CREATE DATABASE IF NOT EXISTS helpdesk
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE helpdesk;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  papel ENUM('cliente', 'tecnico') NOT NULL DEFAULT 'cliente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chamados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  tecnico_id INT DEFAULT NULL,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  status ENUM('Aberto', 'Em Atendimento', 'Concluido') NOT NULL DEFAULT 'Aberto',
  prioridade ENUM('Baixa', 'Media', 'Alta') NOT NULL DEFAULT 'Media',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_chamados_cliente FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_chamados_tecnico FOREIGN KEY (tecnico_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comentarios_chamado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chamado_id INT NOT NULL,
  autor_id INT NOT NULL,
  mensagem TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comentarios_chamado FOREIGN KEY (chamado_id) REFERENCES chamados(id) ON DELETE CASCADE,
  CONSTRAINT fk_comentarios_autor FOREIGN KEY (autor_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;
