#!/usr/bin/env bash
set -euo pipefail

export PATH="$HOME/.cargo/bin:$HOME/.bun/bin:$HOME/.local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:$PATH"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${PROJECT_DIR:-$DIR}"
PORT="${PORT:-5220}"
URL="http://127.0.0.1:${PORT}"

if curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null | grep -q "200"; then
  echo "[Cinnamon] Servidor ya activo en $URL"
else
  echo "[Cinnamon] Iniciando servidor de atelier..."
  "$PROJECT_DIR/run.sh"
fi

open "$URL"

osascript -e 'display notification "Atelier de datos y arte vectorial abierto" with title "Cinnamon" subtitle "En línea en :5220"' 2>/dev/null || true
