from TTS.api import TTS
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs

PORT = 8000

# print(TTS.list_models())
model_name = "tts_models/en/ljspeech/speedy-speech"
tts = TTS(model_name)


class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        filename = "output.wav"
        tts.tts_to_file(query_params["q"][0], file_path=filename)
        self.send_response(200)
        self.send_header("Content-type", "audio/wav")
        self.end_headers()
        with open(filename, "rb") as f:
            self.wfile.write(f.read())


httpd = socketserver.TCPServer(("", PORT), MyHTTPRequestHandler)

print("Serving at port", PORT)
httpd.serve_forever()
