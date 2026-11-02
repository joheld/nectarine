#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.cargo/bin:$HOME/.bun/bin:$HOME/.local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:$PATH"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${PROJECT_DIR:-$DIR}"
PORT="${PORT:-5220}"
URL="http://127.0.0.1:${PORT}"

if curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null | grep -q "200"; then
  echo "[Nectarine] Servidor ya activo en $URL"
else
  echo "[Nectarine] Iniciando servidor de taller..."
  "$PROJECT_DIR/run.sh"
fi

open "$URL"

osascript -e 'display notification "Taller de datos y arte vectorial abierto" with title "Nectarine Studio" subtitle "En línea en :5220"' 2>/dev/null || true
