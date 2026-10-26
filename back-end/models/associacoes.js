const Usuario = require("./usuario"); // Certifique-se de que o caminho do model Usuario está correto
const Profissional = require("./profissional");
const Especialidade = require("./especialidade");
const ProfissionalEspecialidade = require("./profissionalEspecialidade");

// Relação 1:1 (Um profissional pertence a um usuário)
Profissional.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

Usuario.hasOne(Profissional, {
  foreignKey: "id_usuario",
  as: "profissional",
});

// Relação N:N (Profissional <-> Especialidades)
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

module.exports = {
  Usuario,
  Profissional,
  Especialidade,
  ProfissionalEspecialidade,
};