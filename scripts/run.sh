#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

npm run db:migrate
npm run build
npm run start
