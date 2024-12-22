const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();

// Middleware'ler
app.use(cors({
    origin: '*',  // Geliştirme ortamında her yerden gelen istekleri kabul edebiliriz
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // JSON verilerini işlemek için gerekli

// POST rotası
app.post('/api/command', (req, res) => {
    const command = req.body.command; // req.body artık undefined olmaz
    console.log(`Received command: ${command}`);

    // Gelen komut üzerinde işlem yap
    if (command === 'execute_task') {
        // İstemciye bir mesaj gönderin veya işlem yapın
        res.status(200).send('Task executed');
    } else {
        res.status(400).send('Unknown command');
    }
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});
