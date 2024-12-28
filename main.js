const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const path = require('path'); // HTML dosyasını serve etmek için
const PORT = 3001;

const app = express();

// Middleware'ler
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Kamera görüntüsünü gösterecek HTML sayfasını serve et
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // 'index.html' dosyasının yolu
});

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

    // Gelen mesajları dinle
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.command === 'send_frame' && data.frame) {
                // Kamera verisini al
                const frameData = data.frame;
                
                // Tüm bağlı istemcilere bu veriyi gönder
                clients.forEach(client => {
                    if (client !== ws) {  // Gönderen istemciye tekrar gönderme
                        client.send(JSON.stringify({
                            command: 'receive_frame',
                            frame: frameData
                        }));
                    }
                });
            }
        } catch (e) {
            console.error('Mesaj işlenemedi: ', e);
        }
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
