const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors'); 
const PORT = 3000;
const app = express();
app.use(cors({
    origin: '*',  // Geliştirme ortamında her yerden gelen istekleri kabul edebiliriz
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post('/api/command', (req, res) => {
    const command = req.body.command;
    console.log(`Received command: ${command}`);

    // Gelen komut üzerinde işlem yap
    if (command === 'execute_task') {
        // İstemciye bir mesaj gönderin veya işlem yapın
        res.status(200).send('Task executed');
    } else {
        res.status(400).send('Unknown command');
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});
