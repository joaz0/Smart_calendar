#!/bin/bash
npx ts-node src/scripts/setup-database.ts || echo "⚠️ Setup falhou, continuando..."
npm start
