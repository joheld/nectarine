#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-5220}"
LOG_FILE="/tmp/lienzo_studio.log"

export PATH="$HOME/.cargo/bin:$HOME/.bun/bin:$HOME/.local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:$PATH"

if command -v bun >/dev/null 2>&1; then
  BUN_BIN="$(command -v bun)"
elif [ -x "$HOME/.bun/bin/bun" ]; then
  BUN_BIN="$HOME/.bun/bin/bun"
elif [ -x "/opt/homebrew/bin/bun" ]; then
  BUN_BIN="/opt/homebrew/bin/bun"
elif [ -x "/usr/local/bin/bun" ]; then
  BUN_BIN="/usr/local/bin/bun"
else
  echo "[Lienzo] Error: No se encontró 'bun' en el sistema."
  echo "Instala bun con: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

echo "[Lienzo] Usando motor en: ${BUN_BIN}"
echo "[Lienzo] Verificando puerto dedicado ${PORT}..."

if ! lsof -i :"$PORT" -t >/dev/null 2>&1; then
  echo "[Lienzo] Iniciando servidor analítico y vectorial en http://127.0.0.1:${PORT}..."
  cd "$DIR"
  nohup "$BUN_BIN" run dev </dev/null >"$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  echo "[Lienzo] Proceso lanzado en segundo plano con PID ${SERVER_PID}."
fi

for i in {1..30}; do
  if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}" 2>/dev/null | grep -q "200"; then
    echo "[Lienzo] Servidor en línea y respondiendo HTTP 200 OK en http://127.0.0.1:${PORT}"
    exit 0
  fi
  sleep 0.5
done

echo "[Lienzo] Error: El servidor no respondió a tiempo. Logs recientes:"
tail -n 25 "$LOG_FILE" 2>/dev/null || true
exit 1
