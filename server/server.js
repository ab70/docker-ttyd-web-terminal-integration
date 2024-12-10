const express = require('express');
const Docker = require('dockerode');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const docker = new Docker();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://frontend:3000",
        "http://192.168.0.107:3000",
        "https://ec2-18-219-216-157.us-east-2.compute.amazonaws.com",
        "https://dev.nnur.ca",
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// Database credentials
const credentials = {
    mysql: {
        host: 'your.mysql.host',
        username: 'root',
        password: 'mysqlpassword',
        port: 3306,
        clientCommand: (username, password, host, port) =>
            `mysql -u ${username} -p${password} -h ${host} -P ${port}`,
    },
    postgresql: {
        host: 'postgres', // Docker Compose service name
        username: 'shonbjho_dealz_app_user',
        password: 'DealzAppUserPassword010203',
        port: 5432,
        dbName: 'shonbjho_dealz_app2',
        clientCommand: (username, password, host, port, dbName) =>
            `PGPASSWORD=${password} psql -U ${username} -h ${host} -p ${port} -d ${dbName}`,
    },
};

// API to spawn terminal
app.post('/api/spawn-terminal', async (req, res) => {
    try {
        const container = await docker.createContainer({
            Image: 'tsl0922/ttyd:alpine',
            Tty: true, // Enable TTY
            OpenStdin: true, // Keep stdin open
            Cmd: ['ttyd', '--port', '7681', '--check-origin=false', '--writable', '/bin/bash'], // Fully interactive terminal
            ExposedPorts: { "7681/tcp": {} },
            HostConfig: {
                PortBindings: {
                    "7681/tcp": [{ HostPort: "7681" }],
                },
            },
        });

        await container.start();

        const containerInfo = await container.inspect();
        const ports = containerInfo.NetworkSettings.Ports["7681/tcp"];
        if (!ports || ports.length === 0) {
            throw new Error('No port bindings found for 7681/tcp');
        }

        const port = ports[0].HostPort;
        const terminalUrl = `http://localhost:${port}`;
        console.log('Terminal URL:', terminalUrl);
        res.json({ terminalUrl });
    } catch (error) {
        console.error('Error spawning terminal:', error);
        res.status(500).json({ error: 'Failed to spawn terminal' });
    }
});


// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
