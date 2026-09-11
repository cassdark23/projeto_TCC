const { DataTypes } = require("sequelize");
const sequelize = require("../banco_de_dados/conexao.js");

const Especialidade = sequelize.define(
  "Especialidade",
  {
    id_especialidade: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
    },
  },
  {
    tableName: "especialidades",
    timestamps: false,
  }
);

module.exports = Especialidade;