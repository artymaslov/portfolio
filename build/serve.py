#!/usr/bin/env python3
"""Local preview server.

python3 -m http.server sends no Cache-Control, so browsers fall back to
heuristic caching and keep serving a stale page after a rebuild. This serves
the same files with no-store, so a reload always shows what is on disk.

    python3 build/serve.py [port]
"""

import io
import os
import re
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

RANGE = re.compile(r"^bytes=(\d*)-(\d*)$")


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        """Answer a Range request with 206 and the bytes asked for.

        SimpleHTTPRequestHandler ignores Range and returns 200 with the whole
        file, so a <video> here cannot seek past what it has already pulled —
        the scrubber moves and the picture does not follow. GitHub Pages serves
        ranges, so without this the preview is harder to scrub than the real
        site, and a seeking bug would look like a bug in the page.
        """
        m = RANGE.match(self.headers.get("Range", "").strip())
        if not m:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        with f:
            size = os.fstat(f.fileno()).st_size
            first, last = m.group(1), m.group(2)
            if first == "":
                if last == "":                     # "bytes=-" means nothing
                    return super().send_head()
                start, end = max(0, size - int(last)), size - 1
            else:
                start = int(first)
                end = min(int(last), size - 1) if last else size - 1

            if start > end or start >= size:
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{size}")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None

            f.seek(start)
            chunk = f.read(end - start + 1)

        self.send_response(206)
        self.send_header("Content-type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(len(chunk)))
        self.end_headers()
        return io.BytesIO(chunk)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4322
    httpd = ThreadingHTTPServer(("", port), partial(Handler, directory=str(ROOT)))
    print(f"serving {ROOT} on http://localhost:{port}")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
