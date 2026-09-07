require('dotenv').config();
const express = require('express'); const cors = require('cors'); const connectDatabase = require('./db');
const authRoutes = require('./routes/authRoutes'); const dogRoutes = require('./routes/dogRoutes');
const app = express(); app.use(cors()); app.use(express.json()); app.use('/api/auth', authRoutes); app.use('/api/dogs', dogRoutes);
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));
app.use((err, req, res, next) => { if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({ message: 'Invalid JSON payload.' }); console.error(err); return res.status(err.status || 500).json({ message: err.message || 'Internal server error.' }); });
if (require.main === module) connectDatabase().then(() => app.listen(process.env.PORT || 3000, () => console.log(`Server listening on port ${process.env.PORT || 3000}`))).catch((error) => { console.error('Database connection failed:', error.message); process.exit(1); });
module.exports = app;
