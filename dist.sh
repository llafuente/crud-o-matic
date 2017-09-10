#!/bin/sh

rm -rf generated/server/public/*

cd angular
npm run build:production
cd ..

git add generated/server/public/
