const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/db');
const xss = require('xss');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

// ===== VALIDACIONES OWASP =====
const reglasValidacion = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('Nombre muy corto'),

  body('correo')
    .trim()
    .isEmail().withMessage('Correo inválido'),

  body('password')
    .isLength({ min: 6 }).withMessage('Password muy corto'),

  body('edad')
    .isInt({ min: 18, max: 100 }).withMessage('Edad inválida')
];

router.post('/', reglasValidacion, async (req, res) => {

  try {

    // 1. VALIDAR ERRORES DE FORMULARIO
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errores: errors.array()
      });
    }

    // 2. SANITIZAR ENTRADAS (XSS)
    const nombre = xss(req.body.nombre);
    const correo = xss(req.body.correo);
    const passwordPlano = req.body.password;
    const edad = req.body.edad;

    // 3. ENCRIPTAR CONTRASEÑA (OWASP A02)
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    const pool = await getConnection();

    // 4. VERIFICAR SI EL CORREO YA EXISTE
    const existe = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT COUNT(*) as total FROM usuarios WHERE correo = @correo');

    if (existe.recordset[0].total > 0) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      });
    }

    // 5. EJECUTAR STORED PROCEDURE DE FORMA SEGURA
    await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('correo', sql.VarChar, correo)
      .input('password', sql.VarChar, passwordHash)
      .input('edad', sql.Int, edad)
      .execute('sp_registrar_usuario');

    res.json({
      mensaje: "Registro de usuario exitoso"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: "Error interno del servidor"
    });

  }

});

module.exports = router;
