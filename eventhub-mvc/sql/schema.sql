-- EventHub - Schema do banco de dados (MySQL)
-- Execute este script na sua instancia (ex: Aiven) antes de subir a aplicacao.

CREATE DATABASE IF NOT EXISTS eventhub
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE eventhub;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  papel ENUM('organizador', 'participante') NOT NULL DEFAULT 'participante',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS eventos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  organizador_id INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  local VARCHAR(200),
  data_evento DATETIME NOT NULL,
  vagas_totais INT NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_eventos_organizador
    FOREIGN KEY (organizador_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inscricoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  evento_id INT NOT NULL,
  participante_id INT NOT NULL,
  status ENUM('confirmada', 'cancelada') NOT NULL DEFAULT 'confirmada',
  inscrito_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inscricoes_evento
    FOREIGN KEY (evento_id) REFERENCES eventos(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_inscricoes_participante
    FOREIGN KEY (participante_id) REFERENCES usuarios(id)
    ON DELETE CASCADE,
  CONSTRAINT uq_inscricao_unica UNIQUE (evento_id, participante_id)
) ENGINE=InnoDB;
