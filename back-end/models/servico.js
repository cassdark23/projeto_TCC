const { DataTypes } = require("sequelize");
const sequelize = require("../banco_de_dados/conexao.js");

const Servico = sequelize.define(
  "Servico",
  {
    id_servico: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    valor_hora: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: "ATIVO",
    },
  },
  {
    tableName: "servicos",
    timestamps: false,
  }
);

module.exports = Servico;