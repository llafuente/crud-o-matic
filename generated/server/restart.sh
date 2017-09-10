#!/bin/sh

npm run build
pgrep node | xargs kill
nohup node src-js/app.js &
