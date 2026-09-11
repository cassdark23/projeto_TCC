const { DataTypes } = require("sequelize");
const sequelize = require("../banco_de_dados/conexao.js");

const Profissional = sequelize.define(
  "Profissional",
  {
    id_profissional: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      unique: true,
      references: {
        model: "usuarios",
        key: "id_usuario",
      },
    },
    status: {
      type: DataTypes.STRING(20),
    },
  },
  {
    tableName: "profissionais",
    timestamps: false,
  }
);

module.exports = Profissional;