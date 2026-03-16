#!/bin/bash
echo "============================================"
echo "  Scribbly - Starting..."
echo "============================================"
[ ! -d "node_modules" ] && npm install
echo "Open: http://localhost:5173  (Ctrl+C to stop)"
npm run dev
