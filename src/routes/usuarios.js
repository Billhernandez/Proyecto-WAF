const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const verificarToken = require('../../middleware/validacion');

router.get('/', verificarToken, async (req, res) => {
  try {

    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT id, correo, nombre, activo
      FROM usuarios
    `);

    res.json(result.recordset);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: "Error obteniendo usuarios"
    });
  }
});

module.exports = router;
