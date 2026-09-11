const { DataTypes } = require("sequelize");
const sequelize = require("../banco_de_dados/conexao.js");

const Pagamento = sequelize.define(
  "Pagamento",
  {
    id_pagamento: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
    },
    forma_pagamento: {
      type: DataTypes.ENUM("PIX", "CARTAO"),
    },
    status: {
      type: DataTypes.STRING(20),
    },
    id_agendamento: {
      type: DataTypes.INTEGER,
      references: {
        model: "agendamentos",
        key: "id_agendamento",
      },
    },
  },
  {
    tableName: "pagamentos",
    timestamps: false,
  }
);

module.exports = Pagamento;