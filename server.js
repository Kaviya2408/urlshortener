import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' })); // React frontend
app.use(express.json());

// ---------------------
// MySQL connection
// ---------------------
let db;
async function getDB() {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    console.log('✅ Database connected');
  }
  return db;
}

// ---------------------
// POST /api/shorten
// ---------------------
app.post('/api/shorten', async (req, res) => {
  try {
    const conn = await getDB();
    const { longUrl, alias } = req.body;
    if (!alias || alias.trim() === '') return res.status(400).json({ error: 'Alias is required' });

    const code = alias.trim();

    const [rows] = await conn.execute('SELECT * FROM urls WHERE custom_alias=?', [code]);
    if (rows.length > 0) return res.status(400).json({ error: 'Alias already in use' });

    await conn.execute('INSERT INTO urls(long_url, short_code, custom_alias) VALUES(?,?,?)', [longUrl, code, code]);
    res.json({ shortUrl: `http://localhost:5000/${code}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------------------
// GET /:code
// ---------------------
app.get('/:code', async (req, res) => {
  try {
    const conn = await getDB();
    const [rows] = await conn.execute('SELECT long_url FROM urls WHERE custom_alias=?', [req.params.code]);
    if (rows.length === 0) return res.status(404).send('URL not found');
    res.redirect(rows[0].long_url);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ---------------------
// Start server
// ---------------------
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
