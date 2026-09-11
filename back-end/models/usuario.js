const { DataTypes } = require("sequelize");
const sequelize = require("../banco_de_dados/conexao.js");

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allownull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allownull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allownull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(255),
      allownull: false,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allownull: false,
    },
    tipo: {
      type: DataTypes.ENUM("CLIENTE", "ADMIN", "PROFISSIONAL"),
      allownull: false,
      defaultValue: "CLIENTE",
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "ATIVO",
    },
  },
  {
    tableName: "usuarios",
    timestamps: false,
  }
);

module.exports = Usuario;
