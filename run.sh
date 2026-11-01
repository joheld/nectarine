#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-5220}"
LOG_FILE="/tmp/vectura_studio.log"

# Export portable PATH for non-interactive environments (macOS AppleScript / Automator / .app)
export PATH="$HOME/.cargo/bin:$HOME/.bun/bin:$HOME/.local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:$PATH"

# Resolve bun executable dynamically
if command -v bun >/dev/null 2>&1; then
  BUN_BIN="$(command -v bun)"
elif [ -x "$HOME/.bun/bin/bun" ]; then
  BUN_BIN="$HOME/.bun/bin/bun"
elif [ -x "/opt/homebrew/bin/bun" ]; then
  BUN_BIN="/opt/homebrew/bin/bun"
elif [ -x "/usr/local/bin/bun" ]; then
  BUN_BIN="/usr/local/bin/bun"
else
  echo "[Vectura] Error: No se encontró 'bun' en el sistema."
  echo "Instala bun con: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

echo "[Vectura] Usando motor en: ${BUN_BIN}"
echo "[Vectura] Verificando puerto dedicado ${PORT}..."

# If port is not listening, launch background server detached from stdin/signals
if ! lsof -i :"$PORT" -t >/dev/null 2>&1; then
  echo "[Vectura] Iniciando servidor analítico y vectorial en http://127.0.0.1:${PORT}..."
  cd "$DIR"
  nohup "$BUN_BIN" run dev </dev/null >"$LOG_FILE" 2>&1 &
  SERVER_PID=$!
  echo "[Vectura] Proceso lanzado en segundo plano con PID ${SERVER_PID}."
fi

# Poll socket for up to 15 seconds
for i in {1..30}; do
  if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}" 2>/dev/null | grep -q "200"; then
    echo "[Vectura] Servidor en línea y respondiendo HTTP 200 OK en http://127.0.0.1:${PORT}"
    exit 0
  fi
  sleep 0.5
done

echo "[Vectura] Error: El servidor no respondió a tiempo. Logs recientes:"
tail -n 25 "$LOG_FILE" 2>/dev/null || true
exit 1
