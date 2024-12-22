const express = require('express');
const cors = require('cors');
const WebSocket = require('ws'); // WebSocket için kütüphane
const PORT = process.env.PORT || 3000; // Render ortamında PORT'u kullan

const app = express();

// Middleware'ler
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// WebSocket sunucusu başlat
const server = app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});
const wss = new WebSocket.Server({ server }); // HTTP sunucusunu WebSocket ile bağla

// Bağlanan istemcileri tutacak bir dizi
let clients = [];

wss.on('connection', (ws) => {
    console.log('Yeni bir istemci bağlandı.');

    // İstemciyi listeye ekle
    clients.push(ws);

    // İstemci bağlantısını kapattığında listeden çıkar
    ws.on('close', () => {
        console.log('Bir istemci bağlantıyı kapattı.');
        clients = clients.filter(client => client !== ws);
    });
});

// POST rotası
app.post('/api/command', (req, res) => {
    const command = req.body.command; // Gelen komut
    console.log(`Received command: ${command}`);

    if (clients.length === 0) {
        return res.status(500).send('No connected WebSocket clients.');
    }

    // WebSocket üzerinden tüm bağlı istemcilere komut gönder
    clients.forEach(client => {
        client.send(JSON.stringify({ command }));
    });

    res.status(200).send('Command sent to WebSocket clients.');
});
// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});
