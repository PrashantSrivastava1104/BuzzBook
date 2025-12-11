
import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test DB connection
        await pool.query('SELECT NOW()');
        console.log('Database connected successfully.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
};

startServer();
