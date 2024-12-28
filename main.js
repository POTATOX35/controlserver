const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const https = require('https');
const PORT = 3001;

const app = express();

// Middleware'ler
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Kamera verisini saklamak için değişken
let currentFrame = null;

// Kamera görüntüsünü gösterecek HTML sayfasını serve et
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // 'index.html' dosyasının yolu
});

// Kamera verisini almak için GET rotası
app.get('/api/frame', (req, res) => {
    if (currentFrame) {
        res.status(200).json({ frame: currentFrame });
    } else {
        res.status(404).send('No frame data available');
    }
});

// HTTPS server başlatmak için gerekli sertifikalar
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
}, app);

// WebSocket sunucusu başlat
const wss = new WebSocket.Server({ server });

// WebSocket bağlantılarını tutacak bir dizi
wss.on('connection', (ws) => {
    console.log('Yeni bir istemci bağlandı.');

    // Gelen mesajları dinle
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.command === 'send_frame' && data.frame) {
                // Gelen kamera verisini sakla
                currentFrame = data.frame;
            }
        } catch (e) {
            console.error('Mesaj işlenemedi: ', e);
        }
    });
});

// Server'ı başlat
server.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});
