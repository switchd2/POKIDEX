#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# setup-podman.sh — Remove Docker, install Podman + podman-compose
# Run on your cloud VM (Ubuntu/Debian or Amazon Linux 2023)
# ─────────────────────────────────────────────────────────────
set -e

detect_os() {
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "$ID"
  else
    echo "unknown"
  fi
}

OS=$(detect_os)

echo "▶ Detected OS: $OS"

# ── 1. Remove Docker ──────────────────────────────────────────
echo ""
echo "▶ Step 1: Removing Docker..."

if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
  sudo apt-get remove -y docker docker-engine docker.io containerd runc docker-compose 2>/dev/null || true
  sudo apt-get autoremove -y
elif [ "$OS" = "amzn" ]; then
  sudo dnf remove -y docker docker-compose 2>/dev/null || true
fi

echo "✔ Docker removed"

# ── 2. Install Podman ─────────────────────────────────────────
echo ""
echo "▶ Step 2: Installing Podman..."

if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
  sudo apt-get update
  sudo apt-get install -y podman
elif [ "$OS" = "amzn" ]; then
  sudo dnf install -y podman
else
  echo "⚠ Unsupported OS: $OS. Install Podman manually from https://podman.io/getting-started/installation"
  exit 1
fi

podman --version
echo "✔ Podman installed"

# ── 3. Install podman-compose ─────────────────────────────────
echo ""
echo "▶ Step 3: Installing podman-compose..."

if ! command -v pip3 &>/dev/null; then
  if [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt-get install -y python3-pip
  elif [ "$OS" = "amzn" ]; then
    sudo dnf install -y python3-pip
  fi
fi

pip3 install podman-compose
echo "✔ podman-compose installed"

# ── 4. Enable lingering (rootless auto-start on reboot) ───────
echo ""
echo "▶ Step 4: Enabling user lingering for rootless Podman..."
sudo loginctl enable-linger "$USER"
echo "✔ Lingering enabled for $USER"

# ── 5. Install systemd service ────────────────────────────────
echo ""
echo "▶ Step 5: Installing systemd service..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_FILE="$SCRIPT_DIR/pokidex.service"

if [ -f "$SERVICE_FILE" ]; then
  mkdir -p ~/.config/systemd/user
  cp "$SERVICE_FILE" ~/.config/systemd/user/pokidex.service
  # Patch WorkingDirectory to actual project path
  sed -i "s|%h/POKIDEX|$SCRIPT_DIR|g" ~/.config/systemd/user/pokidex.service
  systemctl --user daemon-reload
  systemctl --user enable pokidex
  echo "✔ Service installed — run 'systemctl --user start pokidex' to launch"
else
  echo "⚠ pokidex.service not found at $SERVICE_FILE, skipping systemd setup"
fi

# ── 6. Setup .env ─────────────────────────────────────────────
echo ""
echo "▶ Step 6: Setting up .env..."

ENV_EXAMPLE="$SCRIPT_DIR/backend/.env.example"
ENV_FILE="$SCRIPT_DIR/backend/.env"

if [ ! -f "$ENV_FILE" ] && [ -f "$ENV_EXAMPLE" ]; then
  cp "$ENV_EXAMPLE" "$ENV_FILE"
  echo "✔ Copied .env.example → .env"
  echo "⚠ Edit backend/.env and fill in DATABASE_URL, REDIS_URL, JWT_SECRET, etc."
else
  echo "ℹ .env already exists, skipping"
fi

echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Setup complete! Next steps:"
echo ""
echo "  1. Edit backend/.env with your cloud DB credentials"
echo "  2. podman-compose -f podman-compose.yml up -d"
echo "  3. podman exec -it pokidex_backend npx prisma migrate deploy"
echo "  OR use systemd: systemctl --user start pokidex"
echo "═══════════════════════════════════════════════"
