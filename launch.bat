@REM start "" http://localhost/index.html

@echo Off

start "" /min python -m http.server 8000 -b 127.0.0.1

sleep 1

start http://127.0.0.1:8000/index.html