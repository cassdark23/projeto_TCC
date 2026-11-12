const Usuario = require("./usuario");
const Profissional = require("./profissional");
const Especialidade = require("./especialidade");
const ProfissionalEspecialidade = require("./profissionalEspecialidade");
const Agendamento = require("./agendamento");
const Servico = require("./servico");

// 1:1 Profissional <-> Usuario
Profissional.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasOne(Profissional, { foreignKey: "id_usuario", as: "profissional" });

// N:N Profissional <-> Especialidade
Profissional.belongsToMany(Especialidade, {
  through: ProfissionalEspecialidade,
  foreignKey: "id_profissional",
  otherKey: "id_especialidade",
  as: "especialidades",
});
Especialidade.belongsToMany(Profissional, {
  through: ProfissionalEspecialidade,
  foreignKey: "id_especialidade",
  otherKey: "id_profissional",
  as: "profissionais",
});

// Agendamento -> Usuario (cliente)
Agendamento.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
Usuario.hasMany(Agendamento, { foreignKey: "id_usuario", as: "agendamentos" });

// Agendamento -> Servico
Agendamento.belongsTo(Servico, { foreignKey: "id_servico", as: "servico" });
Servico.hasMany(Agendamento, { foreignKey: "id_servico", as: "agendamentos" });

// Agendamento -> Profissional
Agendamento.belongsTo(Profissional, {
  foreignKey: "id_profissional",
  as: "profissional",
});
Profissional.hasMany(Agendamento, {
  foreignKey: "id_profissional",
  as: "agendamentos",
});

module.exports = {
  Usuario,
  Profissional,
  Especialidade,
  ProfissionalEspecialidade,
  Agendamento,
  Servico,
};
