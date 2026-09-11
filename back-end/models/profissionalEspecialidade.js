const { DataTypes } = require("sequelize");
const sequelize = require("../banco_de_dados/conexao.js");

const ProfissionalEspecialidade = sequelize.define(
  "ProfissionalEspecialidade",
  {
    id_profissional: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "profissionais",
        key: "id_profissional",
      },
    },
    id_especialidade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "especialidades",
        key: "id_especialidade",
      },
    },
  },
  {
    tableName: "profissional_especialidade",
    timestamps: false,
  }
);

module.exports = ProfissionalEspecialidade;