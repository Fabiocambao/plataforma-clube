const pool = require('../config/db');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ message: '✅ Login bem-sucedido', user });
    } else {
      res.status(401).json({ message: '❌ Credenciais inválidas' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Erro interno do servidor' });
  }
};

module.exports = { loginUser };
