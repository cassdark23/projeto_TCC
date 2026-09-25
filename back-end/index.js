const express = require("express");
const app = express();
const cors = require('cors')

const usuarioRotas = require("./routes/usuarioRoutes.js");
const servicoRotas = require("./routes/servicoRoutes.js");
const profissionalRotas = require("./routes/profissionalRoutes.js");
const especialidadeRotas = require("./routes/especialidadesRoutes.js");
const profissionalEspecialidadeRotas = require("./routes/profissionalEspecialidadeRoutes.js");
const agendamentoRotas = require("./routes/agendamentoRoutes.js");
const pagamentoRotas = require("./routes/pagamentoRoutes.js");

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type'
}))

app.use(express.json());

app.use("/api", usuarioRotas);
app.use("/api", servicoRotas);
app.use("/api", profissionalRotas);
app.use("/api", especialidadeRotas);
app.use("/api", profissionalEspecialidadeRotas);
app.use("/api", agendamentoRotas);             

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
