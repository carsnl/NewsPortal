start "" /min python -m http.server 5500 --bind 127.0.0.1
start "" explorer http://localhost:5500

start index.html

exit