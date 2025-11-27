const mysql = require('mysql2/promise');

async function verify() {
    try {
        console.log('Connecting to 127.0.0.1:6969...');
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '1691',
            database: 'swiftride',
            port: 6969
        });

        console.log('Connected!');

        // Check existing
        const [rows] = await connection.execute('SELECT * FROM users');
        console.log('Current Users:', rows);

        // Insert test
        console.log('Inserting test user via script...');
        await connection.execute('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            ['script_test@example.com', 'pass', 'Script User', 'user']);

        // Check again
        const [rows2] = await connection.execute('SELECT * FROM users');
        console.log('Users after insert:', rows2);

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

verify();
