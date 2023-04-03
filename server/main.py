from TTS.api import TTS
import os
import time
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs

PORT = 8000

# print(TTS.list_models())
model_name = "tts_models/en/ljspeech/tacotron2-DDC"
tts = TTS(model_name)


def get_random_wav_file():
    return "/tmp/{0}.wav".format(str(round(time.time())))


class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        filename = get_random_wav_file()
        tts.tts_to_file(query_params["q"][0], file_path=filename)
        self.send_response(200)
        self.send_header("Content-type", "audio/wav")
        self.end_headers()
        file2 = get_random_wav_file()
        cmd = 'ffmpeg -i {0} -filter:a "atempo=2" -vn {1}'.format(filename, file2)
        os.system(cmd)
        with open(file2, "rb") as f:
            self.wfile.write(f.read())
        os.remove(filename)
        os.remove(file2)


def start_server():
    httpd = socketserver.TCPServer(("", PORT), MyHTTPRequestHandler)
    print("Serving at port", PORT)
    httpd.serve_forever()


if __name__ == "__main__":
    start_server()
