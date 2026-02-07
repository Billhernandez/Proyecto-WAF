require('dotenv').config();
const PORT = process.env.PORT || 3000;  
const express = require('express');
const helmet = require('helmet');

const cors = require('cors');
const cookieParser = require('cookie-parser');


const authRoutes = require('./src/routes/auth');
const registroRoutes = require('./src/routes/registro');
const verificarToken = require('./middleware/validacion');

const usuariosRoutes = require('./src/routes/usuarios');

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/usuarios", usuariosRoutes);

//app.use(helmet());     // protección de headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(cors());

app.use(express.static('public'));

app.use("/auth", authRoutes);
app.use("/registro", registroRoutes);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.get("/credenciales", verificarToken, (req, res) => {
    res.sendFile(__dirname + "/private/credenciales.html");
});
/*
app.get("/credenciales.html", (req, res) => {
  res.redirect("/");
});

*/
/*app.listen(process.env.PORT, () => {
  console.log("Servidor iniciado");
});
*/
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});