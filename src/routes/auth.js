const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {

  try {

    const { usuario, password } = req.body;

    const pool = await getConnection();

    // 1. Ejecutar Stored Procedure para obtener usuario por correo
    const result = await pool.request()
      .input('correo', sql.VarChar, usuario)
      .execute('sp_login_usuario');

    // 2. Validar si existe el usuario
    if (result.recordset.length === 0) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas"
      });
    }

    const usuarioBD = result.recordset[0];

    // 3. Verificar si está activo
    if (!usuarioBD.activo) {
      return res.status(403).json({
        mensaje: "Usuario inactivo"
      });
    }

    // 4. Comparar contraseña con bcrypt
    const passwordValido = await bcrypt.compare(
      password,
      usuarioBD.password
    );

    if (!passwordValido) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas"
      });
    }

    // 5. Generar JWT
    const token = jwt.sign(
      {
        id: usuarioBD.id,
        correo: usuarioBD.correo,
        nombre: usuarioBD.nombre
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES
      }
    );

    // 6. Responder con token
    //res.json({
      //mensaje: "Login exitoso",
      //token: token
    //});
  // res.redirect("/credenciales.html");
res.cookie("token", token, {
  httpOnly: true
});

  
res.json({
  mensaje: "Login exitoso",
  //token: token
});


  } catch (error) {

    
    console.error("Error en login:", error);

    res.status(500).json({
      mensaje: "Error interno del servidor"
    });

  }

});

module.exports = router;
