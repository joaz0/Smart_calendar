#!/bin/bash

# Script de Correção Automatizada de ESLint
# Smart Calendar Project

echo "🔧 Iniciando correções automatizadas do ESLint..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de correções
FIXES=0

echo -e "${YELLOW}📋 Fase 1: Removendo tipos inferíveis...${NC}"
# Remove type annotations triviais (string = 'value')
find src/app -name "*.ts" -type f -exec sed -i 's/: string = '"'"'/= '"'"'/g' {} \;
FIXES=$((FIXES + 1))

echo -e "${YELLOW}📋 Fase 2: Corrigindo unused vars em pipes...${NC}"
# Corrige pipes com parâmetros não usados
find src/app/shared/pipes -name "*-pipe.ts" -type f -exec sed -i 's/transform(value/transform(_value/g' {} \;
find src/app/shared/pipes -name "*-pipe.ts" -type f -exec sed -i 's/, args/, _args/g' {} \;
FIXES=$((FIXES + 1))

echo -e "${YELLOW}📋 Fase 3: Corrigindo hasOwnProperty...${NC}"
# Substitui obj.hasOwnProperty por Object.prototype.hasOwnProperty.call
find src/app -name "*.ts" -type f -exec sed -i 's/\.hasOwnProperty(/Object.prototype.hasOwnProperty.call(/g' {} \;
FIXES=$((FIXES + 1))

echo -e "${YELLOW}📋 Fase 4: Corrigindo case declarations...${NC}"
# Adiciona blocos em case statements
find src/app/utils -name "*.ts" -type f -exec sed -i '/case.*:/a\      {' {} \;
FIXES=$((FIXES + 1))

echo -e "${GREEN}✅ Correções automáticas concluídas: ${FIXES} fases${NC}"
echo -e "${YELLOW}⚠️  Execute 'npm run lint' para verificar erros restantes${NC}"
