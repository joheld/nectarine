#!/usr/bin/env bash
set -euo pipefail

# Export portable PATH for macOS desktop/app environments
export PATH="$HOME/.cargo/bin:$HOME/.bun/bin:$HOME/.local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:$PATH"

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="${PROJECT_DIR:-$DIR}"
PORT="${PORT:-5220}"
URL="http://127.0.0.1:${PORT}"

# Verify if server is already responding or start it
if curl -s -o /dev/null -w "%{http_code}" "$URL" 2>/dev/null | grep -q "200"; then
  echo "[Vectura] Servidor ya activo en $URL"
else
  echo "[Vectura] Iniciando servidor de atelier..."
  "$PROJECT_DIR/run.sh"
fi

# Open in default macOS web browser
open "$URL"

# Send native notification
osascript -e 'display notification "Atelier vectorial y analítico abierto" with title "Vectura Studio" subtitle "DuckDB-WASM + D3 Engine en :5220"' 2>/dev/null || true
