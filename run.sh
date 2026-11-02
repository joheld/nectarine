#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-5220}"
LOG_FILE="/tmp/nectarine.log"

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
  echo "[Nectarine] Error: No se encontró 'bun' en el sistema."
  echo "Instala bun con: curl -fsSL https://bun.sh/install | bash"
  exit 1
fi

echo "[Nectarine] Usando motor en: ${BUN_BIN}"
echo "[Nectarine] Verificando puerto dedicado ${PORT}..."

# Verificar si el puerto ya está respondiendo HTTP 200 saludable
if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}" 2>/dev/null | grep -q "200"; then
  echo "[Nectarine] Servidor ya activo y saludable en http://127.0.0.1:${PORT}"
  exit 0
fi

# Si el puerto está ocupado pero no responde HTTP 200 (proceso zombie / colgado), liberarlo limpiamente
if lsof -i :"$PORT" -t >/dev/null 2>&1; then
  STALE_PID=$(lsof -ti :"$PORT" 2>/dev/null || true)
  if [ -n "$STALE_PID" ]; then
    echo "[Nectarine] Liberando puerto $PORT retenido por proceso no responsivo (PID $STALE_PID)..."
    kill -9 $STALE_PID 2>/dev/null || true
    sleep 0.5
  fi
fi

echo "[Nectarine] Iniciando servidor analítico y vectorial en http://127.0.0.1:${PORT}..."
cd "$DIR"
nohup "$BUN_BIN" run dev </dev/null >"$LOG_FILE" 2>&1 &
SERVER_PID=$!
echo "[Nectarine] Proceso lanzado en segundo plano con PID ${SERVER_PID}."

for i in {1..30}; do
  if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}" 2>/dev/null | grep -q "200"; then
    echo "[Nectarine] Servidor en línea y respondiendo HTTP 200 OK en http://127.0.0.1:${PORT}"
    exit 0
  fi
  sleep 0.5
done

echo "[Nectarine] Error: El servidor no respondió a tiempo. Logs recientes:"
tail -n 25 "$LOG_FILE" 2>/dev/null || true
exit 1
