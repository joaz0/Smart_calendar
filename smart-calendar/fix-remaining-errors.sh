#!/bin/bash

echo "🔧 Corrigindo erros ESLint restantes..."

# 1. Corrigir empty functions
find src/app -name "*.ts" -type f -exec sed -i 's/subscribe() {}/subscribe(): void { \/\/ Mock implementation }/g' {} \;
find src/app -name "*.ts" -type f -exec sed -i 's/initializeNotifications() {}/initializeNotifications(): void { \/\/ Mock implementation }/g' {} \;
find src/app -name "*.ts" -type f -exec sed -i 's/initializeTheme() {}/initializeTheme(): void { \/\/ Mock implementation }/g' {} \;

# 2. Corrigir Output native
find src/app -name "*.ts" -type f -exec sed -i 's/@Output() change =/@Output() valueChange =/g' {} \;
find src/app -name "*.ts" -type f -exec sed -i 's/@Output() error =/@Output() errorOccurred =/g' {} \;

# 3. Adicionar unknown em vez de any onde possível
find src/app -name "*.ts" -type f -exec sed -i 's/: any\[\]/: unknown\[\]/g' {} \;
find src/app -name "*.ts" -type f -exec sed -i 's/: any)/: unknown)/g' {} \;

# 4. Executar lint --fix
cd /home/joazr/Documentos/Smart_calendar/smart-calendar
npm run lint -- --fix 2>&1 | tail -10

echo "✅ Correções aplicadas. Execute 'npm run lint' para verificar."
