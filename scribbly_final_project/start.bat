@echo off
setlocal
cd /d %~dp0

echo Starting MyScript Infinity Ink...
npm run electron:dev
